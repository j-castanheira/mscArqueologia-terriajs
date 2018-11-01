import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';
import ObserveModelMixin from '../../ObserveModelMixin';
import Styles from './explore-tab.scss';

// The Explore Tab, to visualize and interact with a 3D model and related objects
const SketchComp = createReactClass({
    displayName: 'ExploreTab',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.object,
        urlid: PropTypes.string
    },

    componentDidMount(){
        var iframe = document.getElementById('api-frame');
        var version = '1.0.0';
        var client = new Sketchfab(version, iframe);

        client.init(this.props.urlid, {
            success: function onSuccess(api) {
                api.start();
                api.addEventListener('viewerready', function () {

                    // API is ready to use
                    // Insert your code here
                    console.log('Viewer is ready');

                });
            },
            error: function onError() {
                console.log('Viewer error');
            }
        });
    },

    render() {
        return (
            <div>
                <iframe src="" id="api-frame" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" width="50%" height="100%"/>
            </div>
        )
    },
});

module.exports = SketchComp;
