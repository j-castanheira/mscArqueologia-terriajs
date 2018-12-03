'use strict';

import ObserveModelMixin from '../ObserveModelMixin';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Styles from './information-preview.scss';
import SketchComp from '../ExplorerWindow/Tabs/SketchComp';
import YouTube from 'react-youtube';

/**
 * Information preview section
 */
const InformationPreview = createReactClass({
    displayName: 'InformationPreview',
    mixins: [ObserveModelMixin],


    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object,
        previewed: PropTypes.string
    },

    getInitialState() {
        return {
            currentImg: 0,
            timeToNext: 3000,
            images: this.props.viewState.currentItem.resources.slice(1).map(image => image.url)
        };
    },

    getInfo(info) {
        let infoList = [];
        let i, j;
        if (info != undefined) {
            for (i = 0; i < info.length; i++) {

                if (this.props.previewed == "locations") {
                    let loc = "";
                    //LOCATIONS
                    if (info[i].name != undefined) {
                        for (j = 0; j < info[i].name.length; j++) {
                            if (info[i].name[j].language === "def" || info[i].name[j].language === "en") {
                                info[i].name[j].text.forEach(function (n) {
                                    loc += n + ", ";
                                });
                            }
                        }

                    }

                    if (info[i].coordinates != undefined) {
                        loc += "Lat: " + info[i].coordinates[0].latitude + ", ";
                        loc += "Long: " + info[i].coordinates[0].longitude;
                    }
                    infoList.push(loc);
                }

                //AGENTS
                if (this.props.previewed == "agents") {
                    let agent = "";
                    //AGENTS
                    if (info[i].name != undefined) {
                        for (j = 0; j < info[i].name.length; j++) {
                            if (info[i].name[j].language === "def" || info[i].name[j].language === "en") {
                                info[i].name[j].text.forEach(function (n) {
                                    agent += n + ", ";
                                });
                            }
                        }

                    }

                    if (info[i].dateOfBirth != undefined) {
                        agent += info[i].dateOfBirth + " / ";
                    } else {
                        agent += "??? / ";
                    }

                    if (info[i].dateOfDeath != undefined) {
                        agent += info[i].dateOfDeath;
                    }
                    else {
                        agent += "???";
                    }

                    infoList.push(agent);
                }

                //TIMESPANS
                if (this.props.previewed == "timeSpans") {
                    let times = "";
                    //AGENTS
                    if (info[i].name != undefined) {
                        for (j = 0; j < info[i].name.length; j++) {
                            if (info[i].name[j].language === "def" || info[i].name[j].language === "en") {
                                info[i].name[j].text.forEach(function (n) {
                                    times += n + ", ";
                                });
                            }
                        }

                    }
                    //TIME ( HH:MM:SS - DD/MM/YYYY )
                    if (info[i].begin != undefined) {
                        if (info[i].begin.hour != undefined)
                            times += info[i].begin.hour + ":";
                        else times += "??:";
                        if (info[i].begin.minute != undefined)
                            times += info[i].begin.minute + ":";
                        else times += "??:";
                        if (info[i].begin.second != undefined)
                            times += info[i].begin.second + " - ";
                        else times += "?? - ";
                        if (info[i].begin.day != undefined)
                            times += info[i].begin.day + "/";
                        else times += "??/";
                        if (info[i].begin.month != undefined)
                            times += info[i].begin.month + "/";
                        else times += "??/";
                        if (info[i].begin.year != undefined)
                            times += info[i].begin.year;
                        else times += "????. ";
                    }

                    //TIME ( HH:MM:SS - DD/MM/YYYY )
                    if (info[i].end != undefined) {
                        if (info[i].end.hour != undefined)
                            times += info[i].end.hour + ":";
                        else times += "??:";
                        if (info[i].end.minute != undefined)
                            times += info[i].end.minute + ":";
                        else times += "??:";
                        if (info[i].end.second != undefined)
                            times += info[i].end.second + " - ";
                        else times += "?? - ";
                        if (info[i].end.day != undefined)
                            times += info[i].end.day + "/";
                        else times += "??/";
                        if (info[i].end.month != undefined)
                            times += info[i].end.month + "/";
                        else times += "??/";
                        if (info[i].end.year != undefined)
                            times += info[i].end.year;
                        else times += "????. ";
                    }

                    infoList.push(times);
                }

                //PAGES
                if (this.props.previewed === "sourcePage") {
                    infoList.push(String(info[i]));
                }

                //OTHER THAN THE OTHERS
                if (info[i].language !== undefined) {
                    if (info[i].length === 1) {
                        var p = info[i].text;
                        if (p != undefined)
                            for (j = 0; j < p.length; j++) {
                                infoList.push(String(p[j]));
                            }
                    }
                    else {

                        if (info[i].language === "def" || info[i].language === "en") {
                            var p = info[i].text;
                            if (p !== undefined)
                                for (j = 0; j < p.length; j++) {
                                    infoList.push(String(p[j]));
                                }
                        } else continue
                    }
                }
            }

            if (this.props.previewed === "id") {
                infoList.push("http://10.170.138.201:9200/rest/getResult?id=" + String(info));
            }
        }

        return infoList;
    },

    getType() {
        let type = undefined;
        let types = this.props.viewState.currentItem.dcType;
        let i, j;
        if (types != undefined) {
            console.log("types: ", types);
            for (i = 0; i < types.length; i++) {
                var t = types[i].text;

                let tup = String(t[0]);
                tup = tup.toUpperCase();
                if (tup.includes("IMAGE")) {
                    type = "IMAGE";
                }
                if (tup.includes("3D")) {
                    type = "3D";
                }
                if (tup.includes("VIDEO")) {
                    type = "VIDEO";
                }
                if (tup.includes("MOVIE")) {
                    type = "VIDEO";
                }

                if (tup.includes("TEXT")) {
                    type = "TEXT";
                }
            }
        }
        else {
            type = "NULL";
        }
        if (type == undefined) type = "NULL";
        return type;
    },

    goSourcePage() {
        window.open(this.props.viewState.currentItem.sourcePage[0]);
    },

    changeImg() {
        var img = this.state.currentImg;
        if (img < this.state.images.length - 1) {
            img++
        } else {
            img = 0
        }
        this.setState({currentImg: img});
        console.log("CURR", this.state.currentImg);
    },

    jumpToSlide(index) {
        clearInterval(this.state.intervalId);
        this.setState({
            currentImg: index,
            intervalId: setInterval(this.changeImg, this.state.timeToNext)
        });

    },

    getVideo() {
        var url = String(this.state.images[0]);
        var id = url.split('=');
        console.log("VIDEOURL",id[1]);
        return id[1];
    },

    getModel() {
        var url = String(this.state.images[0]);
        var id = url.split('/');
        var l = id.length;
        console.log("MODEL", id[l - 1]);
        return id[l - 1];
    },

    componentDidMount() {
        let intervalId = setInterval(this.changeImg, this.state.timeToNext);
        this.setState({intervalId: intervalId})
    },

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    },

    render() {
        console.log("RESOURECES",this.props.viewState.currentItem.resources);
        const previewed = this.props.previewed;
        const info = this.props.viewState.currentItem[previewed];
        const repository = this.props.viewState.currentItem.sourceRepositorie[0];
        const name = this.props.viewState.currentItem.dcTitle[0].text[0];
        //const image = this.props.viewState.currentItem.resources[0].url;
        const infoList = this.getInfo(info);
        console.log("INFO", infoList);
        //var images = this.props.viewState.currentItem.resources.map(image => image.url );
        //console.log("IMGS",images);
        //<img name="slide" src={this.state.images[this.state.currentImg]} height="200" width="200"></img>

        //Get type of resource and its url
        const type = this.getType();
        let resource = null;

        if (type == "VIDEO") {
            resource = this.getVideo();
        }
        if (type == "3D") {
            resource = this.getModel();
        }

        //Video options for youtube
        const opts = {
            height: '100%',
            width: '100%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                color: 'white',
                rel: 0
            }
        };

        return (
            <div className={Styles.preview}>
                <div className={Styles.root}>
                    {repository !== 'Personal' ?
                    <button type='button' onClick={this.goSourcePage}
                            className={Styles.btnAdd}>
                        {'Visit ' + repository + ' page'}
                    </button> : ""}
                    <div className={Styles.previewedInfo}>
                        {type == "IMAGE" ? (
                            <div className={Styles.slideshow}>
                                <ul className={Styles.slideshowslides}>
                                    {
                                        this.state.images.map((slide, index) => (
                                            <li className={(index == this.state.currentImg) ? Styles.active : ''}
                                                key={index}>
                                                <figure className={Styles.fifigure}>
                                                    <a target='_blank' href={this.state.images[this.state.currentImg]}>
                                                        <div className={Styles.imgfit}><img src={slide}/></div>
                                                    </a>
                                                </figure>
                                            </li>
                                        ))
                                    }
                                </ul>
                                <ul className={Styles.slideshowdots}>
                                    {
                                        this.state.images.map((slide, index) => (
                                            <li className={(index == this.state.currentImg) ? Styles.active : ''}
                                                key={index}>
                                                <a onClick={(event) => this.jumpToSlide(index)}>{index + 1}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>) : ""}

                        {type == "3D" ? (
                            <div className={Styles.slideshow}>
                                <SketchComp urlid={resource}/>
                            </div>
                        ) : ""}

                        {type == "VIDEO" ? (
                            <div className={Styles.slideshow}>
                                <YouTube videoId={resource} opts={opts}/>
                            </div>
                        ) : ""}


                        <h3 className={Styles.h3}>{name}</h3>
                        <div>
                            <ul>
                                {
                                    infoList.map((item, index) => <li key={index}>{item}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = InformationPreview;
