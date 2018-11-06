import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';
import ObserveModelMixin from '../../ObserveModelMixin';
import Styles from './slideshow-comp.scss';
// The Explore Tab, to visualize and interact with a 3D model and related objects
const SlideshowComp = createReactClass({
    displayName: 'SlideshowComp',
    mixins: [ObserveModelMixin],

    propTypes: {
        images: PropTypes.array
    },

    getInitialState() {
        return {
            currentImg: 0,
            timeToNext: 3000
        };
    },

    changeImg() {
        var img = this.state.currentImg;
        if (img < this.props.images.length - 1) {
            img++
        } else {
            img = 0
        }
        this.setState({currentImg: img});
    },

    jumpToSlide(index) {
        clearInterval(this.state.intervalId);
        this.setState({
            currentImg: index,
            intervalId: setInterval(this.changeImg, this.state.timeToNext)
        });

    },

    componentDidMount() {
        let intervalId = setInterval(this.changeImg, this.state.timeToNext);
        this.setState({intervalId: intervalId})
    },

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    },

    render() {
        return (
            <div className={Styles.slideshow}>
                <ul className={Styles.slideshowslides}>
                    {
                        this.props.images.map((slide, index) => (
                            <li className={(index == this.state.currentImg) ? Styles.active : ''}
                                key={index}>
                                <figure className={Styles.fifigure}>
                                    <a target='_blank' href={this.props.images[this.state.currentImg]}>
                                        <div className={Styles.imgfit}><img src={slide}/></div>
                                    </a>
                                </figure>
                            </li>
                        ))
                    }
                </ul>
                <ul className={Styles.slideshowdots}>
                    {
                        this.props.images.map((slide, index) => (
                            <li className={(index == this.state.currentImg) ? Styles.active : ''}
                                key={index}>
                                <a onClick={(event) => this.jumpToSlide(index)}>{index + 1}</a>
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    },
});

module.exports = SlideshowComp;
