'use strict';

import classNames from 'classnames';
import defined from 'terriajs-cesium/Source/Core/defined';
import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';
import Loader from '../../Loader.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';
import proxyCatalogItemUrl from '../../../Models/proxyCatalogItemUrl';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Styles from './legend.scss';
var Rectangle = require('terriajs-cesium/Source/Core/Rectangle');
var CesiumMath = require('terriajs-cesium/Source/Core/Math');
var PickedFeatures = require('../../../Map/PickedFeatures');

const ObjectItem = createReactClass({
    displayName: 'ObjectItem',
    mixins: [ObserveModelMixin],

    propTypes: {
        object: PropTypes.object,
        item: PropTypes.object,
        list: PropTypes.object
    },

    zoomToObject() {
        //console.log("CMON",this.props.object.number);
        var objectId = this.props.object.number.Id;

        var terria = this.props.list.props.item.terria;
        //console.log("FEATURES",terria.pickedFeatures);
        //console.log("PICKEDFEATURE",terria.selectedFeature);
        terria.pickedFeatures = undefined;
        terria.selectedFeature = undefined;

        var fakeFeature = this.props.list.props.item.dataSource._entityCollection._entities._array[parseInt(objectId)];
        var result = new PickedFeatures();
        result.isLoading = false;
        result.features.push(fakeFeature);
        /**
        console.log("VIEWER",terria.currentViewer);
        console.log("DATASOURCE", this.props.list.props.item.dataSource._entityCollection);
        console.log("OBJECT",this.props.object);
        console.log("Id",objectId);
        console.log("SELECTED ENTITY",fakeFeature);
        **/

        console.log("DATA", this.props.list.props.item);

        if(this.props.object.number.Longitude !== "NA")
        {
            //Wait for some seconds and then open the feature information
            setTimeout(() => {
                terria.selectedFeature = fakeFeature;
            }, 3000);

            setTimeout(() => {
                terria.pickedFeatures = result;
                terria.selectedFeature = fakeFeature;
            }, 3500);

            var longitude = this.props.object.number.Longitude;
            var latitude = this.props.object.number.Latitude;
            var offset = CesiumMath.EPSILON5 * 4;
            var north = CesiumMath.toRadians(latitude) + offset;
            var south = CesiumMath.toRadians(latitude) - offset;
            var east = CesiumMath.toRadians(longitude) + offset;
            var west = CesiumMath.toRadians(longitude) - offset;
            var rect = new Rectangle(west, south, east, north);

            return terria.currentViewer.zoomTo(rect);
        }
        else
        {
            terria.pickedFeatures = result;
            terria.selectedFeature = fakeFeature;
            return terria.currentViewer.zoomTo(this.props.list.props.item.rectangle);
        }

    },

    render() {
        var hasCoordinates = "Y";
        if(this.props.object.number.Longitude === "NA")
            hasCoordinates = "X";
        const objectTitle = hasCoordinates + " - " + this.props.object.number.Title;
        return (
            <div
                onMouseDown={this.zoomToObject}
                onTouchStart={this.zoomToObject}>
                <li className="Object">
                    <a>{objectTitle}</a>
                </li>
            </div>
        );


    }
});


module.exports = ObjectItem;
