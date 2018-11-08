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
import Styles from './objectItem.scss';
import Icon from '../../Icon.jsx';

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
        var objectId = this.props.object.number.Id;

        var terria = this.props.list.props.item.terria;
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

        if (this.props.object.number.Longitude !== "NA") {
            // Wait for some seconds and then open the feature information
            setTimeout(() => {
                terria.selectedFeature = fakeFeature;
            }, 3000);

            setTimeout(() => {
                terria.pickedFeatures = result;
                terria.selectedFeature = fakeFeature;
            }, 3500);

            // Delete fakefeature
            result.features.splice(result.features.length, 1);


            const longitude = this.props.object.number.Longitude;
            const latitude = this.props.object.number.Latitude;
            const offset = CesiumMath.EPSILON5 * 4;
            const north = CesiumMath.toRadians(latitude) + offset;
            const south = CesiumMath.toRadians(latitude) - offset;
            const east = CesiumMath.toRadians(longitude) + offset;
            const west = CesiumMath.toRadians(longitude) - offset;
            const rect = new Rectangle(west, south, east, north);

            return terria.currentViewer.zoomTo(rect);
        }
        else {
            terria.pickedFeatures = result;
            terria.selectedFeature = fakeFeature;
            result.features.splice(result.features.length, 1);
            return terria.currentViewer.zoomTo(this.props.list.props.item.rectangle);
        }

    },

    render() {
        let iconCoordinates = Icon.GLYPHS.location;
        if (this.props.object.number.Longitude === "NA")
            iconCoordinates = Icon.GLYPHS.remove;
        let objTitle = this.props.object.number.Title;
        const titleLength = objTitle.length;
        if(titleLength > 35)
            objTitle = objTitle.slice(0,35) + "...";
        return (
                <li className={Styles.objectLi}>
                    <button type="button" className={Styles['object-button']} onClick={this.zoomToObject}>
                        <span className={Styles["icon--coordinates"]}><Icon glyph={iconCoordinates}/></span>{objTitle}
                    </button>
                </li>
        );


    }
});


module.exports = ObjectItem;
