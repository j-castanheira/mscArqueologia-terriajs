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
        let newVidId = this.state.videoIds;
        this.state.videoIds.forEach(function getUrls(video,cnt) {
            //console.log("VIDEO",video);
             loadJson(video).then(function (jsonData) {
                var url = jsonData.results[0].resources[1].url;
                var id = url.split('=');
                newVidId.splice(cnt,1,id[1]);
            }).otherwise(function (error) {
                console.log("ERROR");
            });
        });
        console.log("videos",newVidId);
        this.setState({videoIds: newVidId});

        // Get the image resources from the objects
        let foundImgs = false;
        let newImgs = this.state.images;
        this.state.images.forEach(function getUrls(img,cnt) {
            console.log("IMG",img);
            loadJson(img).then(function (jsonData) {
                let allImgs = [];
                console.log(jsonData.results);
                let resources = jsonData.results[0].resources.slice(1).map(image => image.url);
                for (let resource in resources) {
                    //console.log("RESOURCE",resource);
                    allImgs.push(resources[resource]);
                }
                newImgs.splice(cnt,1,allImgs);
                foundImgs = true;
            }).otherwise(function (error) {
                console.log("ERROR",error);
            });
        });
        //console.log("IMAGES",newImgs);
        //console.log("FOUND", foundImgs);
        this.setState({images: newImgs});
    },

    changeAnot(index) {
        this.setState({currentAnot: index});
        //console.log("CHANGE", index);
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
                    {this.state.currentAnot !== null ? (
                        <div id={"annotation-" + this.state.currentAnot}
                             className={Styles.slideactive}>
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
