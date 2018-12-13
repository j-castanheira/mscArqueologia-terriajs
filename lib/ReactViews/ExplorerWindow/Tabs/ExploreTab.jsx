import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import InformationList from '../../DataCatalog/InformationList.jsx';
import InformationPreview from '../../Preview/InformationPreview.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';
import loadJson from 'terriajs-cesium/Source/Core/loadJson';

import Styles from './explore-tab.scss';
import SketchComp from './SketchComp';
import YouTube from 'react-youtube';
import SlideshowComp from './SlideshowComp';
var exploreJson = require('../../../../../../wwwroot/init/explore.json');

// The Explore Tab, to visualize and interact with a 3D model and related objects
const ExploreTab = createReactClass({
    displayName: 'ExploreTab',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.object,
    },

    getInitialState() {
        return {
            title: exploreJson.title,
            description: exploreJson.description,
            modelId: exploreJson.modelId,
            videoIds: exploreJson.videoIds,
            images: exploreJson.images,
            currentAnot: null,
            selectedAnot: null
        };
    },

    UNSAFE_componentWillMount(){

        // Get the video resources from the objects
        let newVidId = [];
        let order = [];
        let it = 0;
        let number = 0;
        this.state.videoIds.forEach(function getUrls(video) {
            console.log("VIDEO",video);
            loadJson(video).then(function (jsonData) {
                console.log("IM HERE");
                var url = jsonData.result.resources[1].url;
                var id = url.split('=');
                newVidId.push(id[1]);
                order.push(number++);
            }).otherwise(function (error) {
                console.log("ERROR");
            });
            it++;
        });
        console.log("NEW VIDS",newVidId);
        console.log("ORDER",order);
        this.setState({videoIds: newVidId});

        // Get the image resources from the objects
        let newImgs = [];
        let it2 = 0;
        this.state.images.forEach(function getUrls(img) {
            loadJson(img).then(function (jsonData) {
                console.log("IM HERE");
                let allImgs = [];
                let resources = jsonData.result.resources.slice(1).map(image => image.url);
                for (let resource in resources) {
                    allImgs.push(resources[resource]);
                }

                newImgs.push(allImgs);
            }).otherwise(function (error) {
                console.log("ERROR");
            });
            it2++;
        });
        console.log("NEW Imgs",newImgs);
        this.setState({images: newImgs});

    },

    changeAnot(index) {
        this.setState({currentAnot: index});
        console.log("CHANGE", index);
    },

    selectAnot(index) {
        this.setState({selectedAnot: index});
        console.log("SELECT", index);
    },

    render() {
        const videoIds = this.state.videoIds;
        const opts = {
            height: '50%',
            width: '100%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                color: 'white',
                loop: 1,
                playlist: videoIds[this.state.currentAnot],
                rel: 0,
                controls: 0
            }
        };
        const styles = {
            width: '100%',
            height: 'auto'
        };
        return (
            <div className={Styles.root}>
                <div className={Styles.tableft}>
                    <SketchComp urlid={this.state.modelId}
                                handler={this.changeAnot} select={this.selectAnot}/>
                </div>
                <div className={this.state.currentAnot === null ? Styles.tabright2 : Styles.tabright}>
                    {this.state.currentAnot === null ? (
                        <div className={Styles.description}>
                            <h1>{this.state.title}</h1>
                            <p>{this.state.description}</p>
                        </div>
                    ) : ""}
                    {this.state.currentAnot === 0 ? (
                        <div id="annotation-entrance"
                             className={this.state.currentAnot === 0 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <SlideshowComp images={this.state.images[this.state.currentAnot]}/>
                        </div>) : ""}
                    {this.state.currentAnot === 1 ? (
                        <div id="annotation-passage"
                             className={this.state.currentAnot === 1 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <SlideshowComp images={this.state.images[this.state.currentAnot]}/>
                        </div>) : ""}

                    {this.state.currentAnot === 2 ? (
                        <div id="annotation-kerbstone52"
                             className={this.state.currentAnot === 2 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <SlideshowComp images={this.state.images[this.state.currentAnot]}/>
                        </div>) : ""}

                    {this.state.currentAnot === 3 ? (
                        <div id="annotation-kerbstone67"
                             className={this.state.currentAnot === 3 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <SlideshowComp images={this.state.images[this.state.currentAnot]}/>
                        </div>) : ""}
                    {this.state.currentAnot === 4 ? (
                        <div id="annotation-otrosthat"
                             className={this.state.currentAnot === 4 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <SlideshowComp images={this.state.images[this.state.currentAnot]}/>
                        </div>) : ""}
                </div>
                <div className={Styles.clear}></div>
            </div>
        );
    },
});

module.exports = ExploreTab;
