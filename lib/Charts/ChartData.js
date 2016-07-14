'use strict';

import d3 from 'd3';

import defaultValue from 'terriajs-cesium/Source/Core/defaultValue';

/**
 * A container to pass data to a d3 chart.
 * For documentation on the custom <chart> tag, see lib/Models/registerCustomComponentTypes.js.
 * 
 * @param {Object[]} [points] The array of points. Each point should have the format {x: X, y: Y}. Defaults to [].
 * @param {Object} [parameters] Further parameters.
 * @param {String} [parameters.id] Unique id for this set of points.
 * @param {String} [parameters.categoryName] Name of the category for this set of points., eg. the source catalog item.
 * @param {String} [parameters.name] Name for this set of points.
 * @param {String} [parameters.units] Units of this set of points.
 * @param {String} [parameters.color] CSS color code for this set of points.
 */
var ChartData = function(points, parameters) {
    parameters = defaultValue(parameters, defaultValue.EMPTY_OBJECT);
    /**
     * The array of points. Each point should have the format {x: X, y: Y}.
     * @type {Object[]}
     */
    this.points = defaultValue(points, []);

    /**
     * A selected point from the array above. Used internally by charting functions for hover/clicking functionality.
     * @type {Object}
     */
    this.point = undefined;

    /**
     * Unique id for this set of points.
     * @type {String}
     */
    this.id = parameters.id;

    /**
     * Name of the category for this set of points., eg. the source catalog item.
     * @type {String}
     */
    this.categoryName = parameters.categoryName;

    /**
     * Name for this set of points.
     * @type {String}
     */
    this.name = parameters.name;

    /**
     * Units of this set of points.
     * @type {String}
     */
    this.units = parameters.units;

    /**
     * CSS color code for this set of points.
     * @type {String}
     */
    this.color = parameters.color;

};

/**
 * Calculates the min and max x and y of the points.
 * If there are no points, returns undefined.
 * @return {Object} An object {x: [xmin, xmax], y: [ymin, ymax]}.
 */
ChartData.prototype.getDomain = function() {
    const points = this.points;
    if (points.length === 0) {
        return;
    }
    return {
        x: [d3.min(points, point=>point.x), d3.max(points, point=>point.x)],
        y: [d3.min(points, point=>point.y), d3.max(points, point=>point.y)]
    };
};


module.exports = ChartData;