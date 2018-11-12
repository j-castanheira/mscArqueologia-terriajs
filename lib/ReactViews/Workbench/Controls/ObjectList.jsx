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
import URI from 'urijs';
import Styles from './objectList.scss';
import ObjectItem from './ObjectItem';
import Icon from '../../Icon.jsx';
// var icons = require('../../../../../../node_modules/@fortawesome/fontawesome-free/css/all.css');

const ObjectList = createReactClass({
    displayName: 'ObjectList',
    mixins: [ObserveModelMixin],

    propTypes: {
        item: PropTypes.object
    },

    getInitialState() {
        return {
            openTab: null,
            models: null,
            images: null,
            texts: null,
            videos: null,
            others: null
        };
    },

    getResources(objects, type) {
        let i;
        let typeL = 0;
        const l = objects.length;
        let results = [];
        for (i = 0; i < l; i++) {
            if (String(objects[i].number.Type) === type) {
                results.push(objects[i]);
                typeL++;
            }
        }

        switch (type) {
            case 'IMAGE': this.setState({images: typeL});
                break;

            case 'TEXT': this.setState({texts: typeL});
                break;

            case 'VIDEO': this.setState({videos: typeL});
                break;

            case '3D': this.setState({models: typeL});
                break;

            case 'null': this.setState({others: typeL});
                break;

        }

        return results;
    },

    changeTab(type) {
        if (this.state.openTab === type) {
            this.setState({
                openTab: null
            });
        }
        else {
            this.setState({
                openTab: type
            });
        }

    },

    render() {
        let datasource = this.props.item.dataSource;
        let objects;
        if (datasource !== undefined)
            objects = datasource._rowObjects;

        let modelList = [];
        let imageList = [];
        let videoList = [];
        let textList = [];
        let othersList = [];

        // We have a finite number of categories for the resources
        if (objects !== undefined) {
            modelList = this.getResources(objects, '3D');
            imageList = this.getResources(objects, 'IMAGE');
            textList = this.getResources(objects, 'TEXT');
            videoList = this.getResources(objects, 'VIDEO');
            othersList = this.getResources(objects, 'null');
        }

        return (
            <ul className={Styles.objectList}>
                <Choose>
                    <When condition={objects === undefined}>
                        <li className={Styles.loader}><Loader message={this.props.item.loadingMessage}/></li>
                    </When>
                    <Otherwise>
                        <li className={Styles['type--list']}>
                            <button type="button" className={Styles['object-button']}
                                    onClick={() => {
                                        this.changeTab('IMAGE');
                                    }}>
                                    <span className={Styles["icon--types"]}><Icon
                                        glyph={Icon.GLYPHS.image}/></span> Image Resources ({this.state.images})
                                <span className={Styles["icon--tab"]}><Icon
                                    glyph={this.state.openTab === 'IMAGE' ? Icon.GLYPHS.opened : Icon.GLYPHS.closed}/></span>
                            </button>
                        </li>
                        {this.state.openTab === 'IMAGE' ?
                            imageList.map((object, k) => {
                                return (
                                    <ObjectItem key={k} object={object} list={this}/>
                                );
                            }) : ""}

                        <li className={Styles['type--list']}>
                            <button type="button" className={Styles['object-button']}
                                    onClick={() => {
                                        this.changeTab('VIDEO');
                                    }}>
                                    <span className={Styles["icon--types"]}><Icon
                                        glyph={Icon.GLYPHS.video}/></span> Video Resources ({this.state.videos})

                                <span className={Styles["icon--tab"]}><Icon
                                    glyph={this.state.openTab === 'VIDEO' ? Icon.GLYPHS.opened : Icon.GLYPHS.closed}/></span>
                            </button>
                        </li>

                        {this.state.openTab === 'VIDEO' ?
                            videoList.map((object, k) => {
                                return (
                                    <ObjectItem key={k} object={object} list={this}/>
                                );
                            }) : ""}

                        <li className={Styles['type--list']}>
                            <button type="button" className={Styles['object-button']}
                                    onClick={() => {
                                        this.changeTab('MODEL');
                                    }}>
                                <span className={Styles["icon--types"]}><Icon glyph={Icon.GLYPHS.model}/></span> 3D
                                Resources ({this.state.models})

                                <span className={Styles["icon--tab"]}><Icon
                                    glyph={this.state.openTab === 'MODEL' ? Icon.GLYPHS.opened : Icon.GLYPHS.closed}/></span>
                            </button>
                        </li>

                        {this.state.openTab === 'MODEL' ?
                            modelList.map((object, k) => {
                                return (
                                    <ObjectItem key={k} object={object} list={this}/>
                                );
                            }) : ""}

                        <li className={Styles['type--list']}>
                            <button type="button" className={Styles['object-button']}
                                    onClick={() => {
                                        this.changeTab('TEXT');
                                    }}>
                                <span className={Styles["icon--types"]}><Icon glyph={Icon.GLYPHS.text}/></span> Text
                                Resources ({this.state.texts})

                                <span className={Styles["icon--tab"]}><Icon
                                    glyph={this.state.openTab === 'TEXT' ? Icon.GLYPHS.opened : Icon.GLYPHS.closed}/></span>
                            </button>
                        </li>

                        {this.state.openTab === 'TEXT' ?
                            textList.map((object, k) => {
                                return (
                                    <ObjectItem key={k} object={object} list={this}/>
                                );
                            }) : ""}

                        <li className={Styles['type--list']}>
                            <button type="button" className={Styles['object-button']}
                                    onClick={() => {
                                        this.changeTab('OTHER');
                                    }}>
                                <span className={Styles["icon--types"]}><Icon
                                    glyph={Icon.GLYPHS.radioOff}/></span> Other
                                Resources ({this.state.others})

                                <span className={Styles["icon--tab"]}><Icon
                                    glyph={this.state.openTab === 'OTHER' ? Icon.GLYPHS.opened : Icon.GLYPHS.closed}/></span>
                            </button>
                        </li>

                        {this.state.openTab === 'OTHER' ?
                            othersList.map((object, k) => {
                                return (
                                    <ObjectItem key={k} object={object} list={this}/>
                                );
                            }) : ""}
                    </Otherwise>
                </Choose>
            </ul>
        );
    },
});

module.exports = ObjectList;


