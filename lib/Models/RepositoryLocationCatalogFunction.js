'use strict';

/*global require*/
var CatalogFunction = require('./CatalogFunction');
var CatalogGroup = require('./CatalogGroup');
var clone = require('terriajs-cesium/Source/Core/clone');
var createParameterFromType = require('./createParameterFromType');
var defined = require('terriajs-cesium/Source/Core/defined');
var defineProperties = require('terriajs-cesium/Source/Core/defineProperties');
var freezeObject = require('terriajs-cesium/Source/Core/freezeObject');
var inherit = require('../Core/inherit');
var knockout = require('terriajs-cesium/Source/ThirdParty/knockout');
var loadJson = require('terriajs-cesium/Source/Core/loadJson');
var proxyCatalogItemUrl = require('./proxyCatalogItemUrl');
var ResultPendingCatalogItem = require('./ResultPendingCatalogItem');
var sprintf = require('terriajs-cesium/Source/ThirdParty/sprintf');
var URI = require('urijs');
var TerriaError = require('../Core/TerriaError');
var CesiumEvent = require('terriajs-cesium/Source/Core/Event');

/**
 * A {@link CatalogFunction} that issues an HTTP GET to a service with a set of query parameters specified by the
 * {@link RepositoryLocationCatalogFunction#inputs} property, and expects to receive back TerriaJS catalog/share JSON.
 *
 * When this `CatalogFunction` is added to the catalog, TerriaJS automatically creates a user interface for it
 * based on the inputs. When the user clicks "Run Analysis", it issues an HTTP GET with the user-specified
 * inputs supplied as part of the query string. The returned TerriaJS catalog/share JSON can add items
 * to the workbench, configure the catalog, change the camera view, and more.
 *
 * Example:
 *
 * ```
 * {
 *   "name": "Simple Example",
 *   "type": "cho-json",
 *   "url": "https://putsreq.com/PK2GvS6jHfWhlBmkadrG",
 *   "inputs": [
 *     {
 *       "id": "position",
 *       "type": "point",
 *       "name": "Position",
 *       "description": "The position to pass to the service.",
 *       "formatter": "longitudeCommaLatitude"
 *     },
 *     {
 *       "id": "someOtherParameter",
 *       "type": "string",
 *       "name": "Some Other Parameter",
 *       "description": "This is another parameter that will be passed to the service."
 *     }
 *   ]
 * }
 * ```
 *
 * For this `CatalogFunction` TerriaJS will present a user interface with two elements: a position on the map
 * and a string. When invoked, TerriaJS will GET a URL like:
 * `https://putsreq.com/PK2GvS6jHfWhlBmkadrG?position=151.0%2C-33.0&someOtherParameter=some%20text`
 *
 * The service is expected to return JSON using the `application/json` content type, and have a body
 * with any of the following:
 *
 *    * A single catalog member
 *
 * For example:
 *
 * ```
 * {
 *   "type": "csv",
 *   "data": "POSTCODE,value\n2000,1"
 * }
 * ```
 *
 * The catalog member will be added to the catalog inside a catalog group directly below this
 * `CatalogFunction`. Catalog items will also be added to the workbench unless `isEnabled` is
 * explicitly set to false.
 *
 * If the catalog item does not have a name, as in the above example, its name will be the name of
 * this `CatalogFunction` followed by the date and time it was invoked in ISO8601 format. If the catalog item
 * does not have a description, it will be given a description explaining that this is the result of executing
 * a service and will include the input parameters sent to the service.
 *
 *    * An array of catalog members
 *
 * An array of catalog members as described above.
 *
 * For example:
 *
 * ```
 * [
 *   {
 *     "type": "csv",
 *     "data": "POSTCODE,value\n2000,1"
 *   },
 *   {
 *     "name": "My Result WMS Layer",
 *     "type": "wms",
 *     "url": "http://ereeftds.bom.gov.au/ereefs/tds/wms/ereefs/mwq_gridAgg_P1A",
 *     "layers": "Chl_MIM_mean"
 *   }
 * ]
 * ```
 *
 *    * A catalog file
 *
 * For example:
 *
 * ```
 * {
 *   "catalog": [
 *     {
 *       "name": "National Datasets",
 *       "type": "group",
 *       "items": [
 *         {
 *           "name": "My Result WMS Layer",
 *           "type": "wms",
 *           "url": "http://ereeftds.bom.gov.au/ereefs/tds/wms/ereefs/mwq_gridAgg_P1A",
 *           "layers": "Chl_MIM_mean",
 *           "isEnabled": true
 *         }
 *       ]
 *     }
 *   ],
 *   "initialCamera": {
 *     "west": 141.0,
 *     "south": -26.0,
 *     "east": 157.0,
 *     "north": -9.0
 *   }
 * }
 * ```
 *
 * Please note that in this case, catalog items are _not_ automatically enabled or named.
 * The `name` property is required. If `isEnabled` is not set to `true`, the catalog item
 * will not appear on the workbench.
 *
 *    * Share data
 *
 * Similar to the above except that it allows multiple init sources (catalog files) and has a
 * version property for backward compatibility. For example:
 *
 * ```
 * {
 *   "version": "0.0.05",
 *   "initSources": [
 *     {
 *       "catalog": [
 *         {
 *           "name": "National Datasets",
 *           "type": "group",
 *           "items": [
 *             {
 *               "name": "My Result WMS Layer",
 *               "type": "wms",
 *               "url": "http://ereeftds.bom.gov.au/ereefs/tds/wms/ereefs/mwq_gridAgg_P1A",
 *               "layers": "Chl_MIM_mean",
 *               "isEnabled": true
 *             }
 *           ]
 *         }
 *       ],
 *     },
 *     {
 *       "initialCamera": {
 *         "west": 141.0,
 *         "south": -26.0,
 *         "east": 157.0,
 *         "north": -9.0
 *       }
 *     }
 *   ]
 * }
 * ```
 *
 * @alias RepositoryLocationCatalogFunction
 * @constructor
 * @extends CatalogFunction
 *
 * @param {Terria} terria The Terria instance.
 */
function RepositoryLocationCatalogFunction(terria) {
    CatalogFunction.call(this, terria);

    /**
     * Gets or sets the URL of the REST server.  This property is observable.
     * @type {String}
     */
    this.url = undefined;

    /**
     * Gets or sets the input parameters to the service.
     * @type {FunctionParameter[]}
     */
    this.inputs = [];

    knockout.track(this, ['url', 'inputs']);
}

inherit(CatalogFunction, RepositoryLocationCatalogFunction);

defineProperties(RepositoryLocationCatalogFunction.prototype, {
    /**
     * Gets the type of data item represented by this instance.
     * @memberOf RepositoryLocationCatalogFunction.prototype
     * @type {String}
     */
    type: {
        get: function () {
            return 'cho-json';
        }
    },

    /**
     * Gets a human-readable name for this type of data source, 'Terria JSON Catalog Function'.
     * @memberOf RepositoryLocationCatalogFunction.prototype
     * @type {String}
     */
    typeName: {
        get: function () {
            return 'Repository JSON Catalog Function';
        }
    },

    /**
     * Gets the set of functions used to update individual properties in {@link CatalogMember#updateFromJson}.
     * When a property name in the returned object literal matches the name of a property on this instance, the value
     * will be called as a function and passed a reference to this instance, a reference to the source JSON object
     * literal, and the name of the property.
     * @memberOf WebMapServiceCatalogItem.prototype
     * @type {Object}
     */
    updaters: {
        get: function () {
            return RepositoryLocationCatalogFunction.defaultUpdaters;
        }
    },

    /**
     * Gets the set of functions used to serialize individual properties in {@link CatalogMember#serializeToJson}.
     * When a property name on the model matches the name of a property in the serializers object literal,
     * the value will be called as a function and passed a reference to the model, a reference to the destination
     * JSON object literal, and the name of the property.
     * @memberOf WebMapServiceCatalogItem.prototype
     * @type {Object}
     */
    serializers: {
        get: function () {
            return RepositoryLocationCatalogFunction.defaultSerializers;
        }
    },

    /**
     * Gets the set of names of the properties to be serialized for this object when {@link CatalogMember#serializeToJson} is called
     * for a share link.
     * @memberOf WebMapServiceCatalogItem.prototype
     * @type {String[]}
     */
    propertiesForSharing: {
        get: function () {
            return RepositoryLocationCatalogFunction.defaultPropertiesForSharing;
        }
    },

    /**
     * Gets the parameters used to {@link CatalogFunction#invoke} to this process.
     * @memberOf CatalogFunction
     * @type {CatalogFunctionParameters[]}
     */
    parameters: {
        get: function () {
            return this.inputs;
        }
    },
});

RepositoryLocationCatalogFunction.defaultUpdaters = clone(CatalogFunction.defaultUpdaters);

RepositoryLocationCatalogFunction.defaultUpdaters.inputs = function (catalogFunction, json, propertyName, options) {
    if (!json.inputs) {
        return;
    }

    catalogFunction.inputs = json.inputs.map(parameterJson => {
        const parameter = createParameterFromType(parameterJson.type, {
            terria: catalogFunction.terria,
            catalogFunction: catalogFunction,
            id: parameterJson.id
        });
        parameter.updateFromJson(parameterJson);
        return parameter;
    });
};

freezeObject(RepositoryLocationCatalogFunction.defaultUpdaters);

RepositoryLocationCatalogFunction.defaultSerializers = clone(CatalogFunction.defaultSerializers);

RepositoryLocationCatalogFunction.defaultSerializers.inputs = function (catalogFunction, json, propertyName, options) {
    if (!catalogFunction.inputs) {
        return;
    }

    json[propertyName] = catalogFunction.inputs.map(parameter => parameter.serializeToJson());
};

freezeObject(RepositoryLocationCatalogFunction.defaultSerializers);

RepositoryLocationCatalogFunction.defaultPropertiesForSharing = clone(CatalogFunction.defaultPropertiesForSharing);

RepositoryLocationCatalogFunction.prototype._load = function () {
};

/**
 * Invoke the REST function with the provided parameterValues.
 * @return {Promise}
 */
RepositoryLocationCatalogFunction.prototype.invoke = function () {
    var now = new Date();
    var timestamp = sprintf('%04d-%02d-%02dT %02d:%02d:%02d', now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

    var asyncResult = new ResultPendingCatalogItem(this.terria);
    var term = this.parameters[0].value;
    asyncResult.name = '"' + term + '"';
    asyncResult.description =
        'This is the result of invoking the ' + this.name + ' process or service at ' + timestamp + ' with the input parameters below.\n\n' +
        '<table class="cesium-infoBox-defaultTable">' +
        (this.parameters || []).reduce(function (previousValue, parameter) {
            return previousValue +
                '<tr>' +
                '<td style="vertical-align: middle">' + parameter.name + '</td>' +
                '<td>' + parameter.formatValueAsString(parameter.value) + '</td>' +
                '</tr>';
        }, '') +
        '</table>';
    //EDITED
    asyncResult.time = timestamp;


    // The function searches for the term on the results
    function searchTerm(searchResults, originalResults) {
        let newResults = originalResults;
        let newTerm = term.toUpperCase();
        for (let result in searchResults) {
            // Search in title
            let title = searchResults[result].dcTitle;
            if (defined(title)) {
                title = title[0].text[0].toUpperCase();
                if (title.includes(newTerm)) {
                    newResults.push(searchResults[result]);
                    continue;
                }
            }

            // Search in creator
            let creator = searchResults[result].dcCreator;
            if (defined(creator)) {
                creator = creator[0].text[0].toUpperCase();
                if (creator.includes(newTerm)) {
                    newResults.push(searchResults[result]);
                    continue;
                }
            }

            //Search in description
            let desc = searchResults[result].dcDescription;
            if (defined(desc)) {
                desc = desc[0].text[0].toUpperCase();
                if (desc.includes(newTerm)) {
                    newResults.push(searchResults[result]);
                    continue;
                }
            }

            //Search in location
            let location = searchResults[result].locations;
            if (defined(location)) {
                location = location[0].name[0].text[0].toUpperCase();
                if (location.includes(newTerm)) {
                    newResults.push(searchResults[result]);
                }
            }
        }
        return newResults;
    }

    // The function returns the parameter without the delimiters
    function removeDelimiters(str) {
        var result = str.replace(/"/g, "\'");
        return result;
    }

    function findCoordinates(locations) {
        var result = undefined;
        for (var location of locations) {
            //console.log(location)

            var coord = location.coordinates;

            if (coord !== undefined) {
                result = location;
                break;
            }
        }
        return result;
    }

    const queryParameters = {};
    console.log("PARAMETERS",this.parameters);

    queryParameters["latitudeFrom"] = Math.floor(this.parameters[0].value.latitude);
    queryParameters["longitudeFrom"] = Math.floor(this.parameters[0].value.longitude);
    queryParameters["latitudeTo"] = Math.floor(this.parameters[1].value.latitude);
    queryParameters["longitudeTo"] = Math.floor(this.parameters[1].value.longitude);

    console.log(queryParameters);
    var uriTemp = new URI(this.url).addQuery(queryParameters);
    const uri = uriTemp;
    console.log(uri);
    const proxiedUrl = proxyCatalogItemUrl(this, uri.toString(), '1d');


    var headers = {
        dataType: 'jsonp'
    }


    const promise = loadJson(proxiedUrl, headers).then(json => {
        asyncResult.isEnabled = false;
        //Convert response:
        let csv_text = "";
        let wantedParams = ['Id', 'Title', 'Creator', 'Description', 'Temporal', 'Location', 'Latitude', 'Longitude', 'Preview', 'Type', 'Repository', 'SourcePage', 'SourceData'];
        let itemResultsPromise = json.results;
        const pobjs = this.terria.personalObjects;
        let itemResults;
        /**if (defined(pobjs)) {
            itemResults = searchTerm(pobjs.results, itemResultsPromise);
        }
        else {
            itemResults = itemResultsPromise;
        }**/
        itemResults = itemResultsPromise;

        console.log("RESULTS", itemResults);
        let results = itemResults.length;

        asyncResult.json = itemResults;
        asyncResult.results = results;
        console.log("JSON", itemResults);

        //Columns
        for (let p in wantedParams) {
            csv_text += "\"" + wantedParams[p];
            csv_text += p != wantedParams.length - 1 ? "\"," : "\"\r\n";
        }

        //Scan all results. For each result we should find each of the parameters and register them. If we don't find them leave it blank.
        //for (let r = 0; r < results.length; r++) {}
        itemResults.forEach(function findParams(item, index) {

            csv_text += index + ",";

            let isCombined = "";
            if (item.isCombinedResut != undefined) isCombined = " (combined)";

            let titles = item.dcTitle;
            if (titles !== undefined)
                csv_text += "\"" + removeDelimiters(titles[0].text[0]) + isCombined + "\",";
            else
                csv_text += "-,";

            //console.log("tit,",titles);
            let creators = item.dcCreator;
            if (creators !== undefined) {
                if (creators[0].text !== undefined)
                    csv_text += "\"" + removeDelimiters(creators[0].text[0]) + "\",";
                else
                    csv_text += "-,";
            }
            else
                csv_text += "-,";

            //console.log("crea,",creators);
            let descriptions = item.dcDescription;
            if (descriptions !== undefined) {
                if (descriptions[0].text !== undefined)
                    csv_text += "\"" + removeDelimiters(descriptions[0].text[0]) + "\",";
                else
                    csv_text += "-,";
            }
            else
                csv_text += "-,";

            //console.log("DES,",descriptions);
            let time = item.dcDate;
            if (time !== undefined)
                csv_text += "\"" + time[0].text[0] + "\",";
            else
                csv_text += "-,";

            //console.log("date,",time);
            //Function to find location and coordinates
            let locations = item.locations;
            if (locations !== undefined) {
                let location = findCoordinates(locations);
                if (location !== undefined) {
                    if (locations[0].name !== undefined)
                        csv_text += "\"" + removeDelimiters(location.name[0].text[0]) + "\",";
                    else
                        csv_text += "-,";

                    let longitude = location.coordinates[0].longitude;
                    let latitude = location.coordinates[0].latitude;
                    csv_text += latitude + ",";
                    csv_text += longitude + ",";
                }
                else {
                    if (locations[0].name !== undefined)
                        csv_text += "\"" + removeDelimiters(locations[0].name[0].text[0]) + "\",NA,NA,";
                    else
                        csv_text += "-,NA,NA,";
                }


                //csv_text += "\""  + locations[0].name[0].text[0] + "\",NA,NA,";
                //csv_text += "\""  + locations[0].name[0].text[0] + "\",NA,NA,";
            }
            else
                csv_text += "-,NA,NA,";

            //console.log("loc,",locations);

            let thumbnail = item.resources;
            csv_text += thumbnail !== undefined ? thumbnail[0].url + "," : "-,";

            let type = item.dcType;
            if (type !== undefined) {
                const firstType = type[0];
                if (firstType.text !== undefined) {
                    const t = firstType.text[0].toUpperCase();

                    if (t.includes('IMAGE'))
                        csv_text += "IMAGE,";

                    if (t.includes('3D'))
                        csv_text += "3D,";

                    if (t.includes('TEXT'))
                        csv_text += "TEXT,";

                    if (t.includes('VIDEO'))
                        csv_text += "VIDEO,";
                }
                else csv_text += "null,";
            }
            else
                csv_text += "null,";

            let repository = item.sourceRepositorie;
            if (repository !== undefined)
                csv_text += repository[0] + ",";
            else
                csv_text += "-,"

            let link = item.sourcePage;
            if (link !== undefined)
                csv_text += link[0] + ",";
            else
                csv_text += "-,"

            let data = item.sourceData;
            if (data !== undefined)
                csv_text += data[0];
            else
                csv_text += "-"

            csv_text += "\r\n";
        })

        //console.log(csv_text);
        let query = {};
        query.type = 'object-csv';
        query.data = csv_text;
        //query.idColumns = "Id";

        query.tableStyle = {};
        query.tableStyle.timeColumn = null;
        query.tableStyle.dataVariable = null;
        query.tableStyle.columns = {};
        query.featureInfoTemplate = {};
        query.featureInfoTemplate.template = "<div class='cho'><center>{{#Preview}}<figure><img style='max-width: 60%; height:auto;' src='{{Preview}}'/><figcaption>{{Description}}</figcaption></figure>{{/Preview}}<p><small>by {{Creator}}, {{Temporal}}</small><p><a target='_blank' href={{SourcePage}}><b>{{Repository}} Resource </b></a></center></div>";
        query.zoomOnEnable = true;

        let json2 = JSON.stringify(query);

        let json3 = JSON.parse(json2);
        console.log(json3);
        // JSON response may be:
        // 1. A single catalog member; it will be added to the workbench.
        // 2. An array of catalog members; they'll all be added to the workbench.
        // 3. A TerriaJS init source (catalog file); it will be merged into the catalogue.
        // 4. A TerriaJS "share data" object, which may contain multiple init sources.
        if (json3.version && json3.initSources) {
            // Case #4
            return this.terria.updateFromStartData(json3);
        } else if (Array.isArray(json3.catalog)) {
            // Case #3
            return this.terria.addInitSource(json3);
        }

        // Case #1 or #2
        const items = Array.isArray(json3) ? json3 : [json3];
        items.forEach(function (item) {
            // Make sure it shows up on the workbench, unless explicitly told not to.
            if (!defined(item.isEnabled)) {
                item.isEnabled = true;
            }
            item.name = item.name || asyncResult.name;
            item.description = item.description || asyncResult.description;
            //EDITED
            item.time = item.time || asyncResult.time;
            item.results = item.results || asyncResult.results;
            item.json = item.json || asyncResult.json;

        });

        // Create a group in the catalog to hold the results
        const resultsGroupId = this.uniqueId + '-results';
        let resultsGroup = this.terria.catalog.shareKeyIndex[resultsGroupId];

        if (!resultsGroup) {
            const parent = this.parent && this.parent.items ? this.parent : this.terria.catalog.group;
            let index = parent.items.indexOf(this);
            if (index >= 0) {
                ++index;
            } else {
                index = parent.items.length;
            }

            resultsGroup = new CatalogGroup(this.terria);
            resultsGroup.id = resultsGroupId;
            resultsGroup.name = this.name + ' Results';
            parent.items.splice(index, 0, resultsGroup);
        }

        return CatalogGroup.updateItems(items, {
            isUserSupplied: true
        }, resultsGroup);
    });

    //console.log("JSON",promise);
    asyncResult.loadPromise = promise;
    asyncResult.isEnabled = true;

    return promise;
};

module.exports = RepositoryLocationCatalogFunction;
