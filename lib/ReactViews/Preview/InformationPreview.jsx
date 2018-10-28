'use strict';

import ObserveModelMixin from '../ObserveModelMixin';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Styles from './information-preview.scss';

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

    getInitialState(){
        return{
            currentImg: 0,
            timeToNext: 3000,
            images: this.props.viewState.currentItem.resources.map(image => image.url)
        };
    },

    getInfo(info)
    {
        let infoList = [];
        let i,j;
        if(info !=undefined) {
            for (i = 0; i < info.length; i++) {
                if (info[i].language === "def" || info[i].language === "en") {
                    var p = info[i].text;
                    if (p != undefined)
                        for (j = 0; j < p.length; j++) {
                            infoList.push(String(p[j]));
                        }
                }
                else continue
            }
        }

        return infoList;
    },

    goSourcePage()
    {
        window.open(this.props.viewState.currentItem.sourcePage[0]);
    },

    changeImg()
    {
        var img = this.state.currentImg;
        if (img < this.state.images.length-1){img++} else {img=0}
        this.setState({currentImg: img});
        console.log("CURR",this.state.currentImg);
    },

    jumpToSlide(index) {
        console.log("jump");
        this.setState({ currentImg: index });
    },

    componentDidMount(){
        let intervalId = setInterval(this.changeImg,this.state.timeToNext);
        this.setState({ intervalId: intervalId })
    },

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    },

    render() {
        const previewed = this.props.previewed;
        const info = this.props.viewState.currentItem[previewed];
        const repository = this.props.viewState.currentItem.sourceRepositorie[0];
        const name = this.props.viewState.currentItem.dcTitle[0].text[0];
        //const image = this.props.viewState.currentItem.resources[0].url;
        console.log(info);
        const infoList = this.getInfo(info);
        console.log(infoList);

        //var images = this.props.viewState.currentItem.resources.map(image => image.url );
        //console.log("IMGS",images);
        console.log("img",this.state.images[this.state.currentImg]);

        return (
            <div className={Styles.preview}>
                <div className={Styles.root}>
                    <button type='button' onClick={this.goSourcePage}
                            className={Styles.btnAdd}>
                        {'Visit ' + repository + ' page'}
                    </button>
                    <div className={Styles.previewedInfo}>
                        <img name="slide" src={this.state.images[this.state.currentImg]} height="200" width="200"></img>
                        <ul className="slideshow-dots">
                            {
                                this.state.images.map((slide, index) => (
                                    <li className={ (index == this.state.currentImg) ? 'active': '' } key={index}>
                                        <a onClick={ (event)=> this.jumpToSlide(index) }>{ index + 1 }</a>
                                    </li>
                                ))
                            }
                        </ul>
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
