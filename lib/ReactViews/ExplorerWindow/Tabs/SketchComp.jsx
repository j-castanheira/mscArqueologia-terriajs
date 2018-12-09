import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';
import ObserveModelMixin from '../../ObserveModelMixin';
import Styles from './explore-tab.scss';
import loadJson from 'terriajs-cesium/Source/Core/loadJson';

// The Explore Tab, to visualize and interact with a 3D model and related objects
const SketchComp = createReactClass({
    displayName: 'ExploreTab',
    mixins: [ObserveModelMixin],

    propTypes: {
        urlid: PropTypes.string,
        handler: PropTypes.func,
        select: PropTypes.func
    },

    getInitialState() {
        return{
            _api: null
        };
    },

    componentDidMount() {
        const oembedUrl= 'https://sketchfab.com/oembed?url=' + this.props.urlid;
        var self = this;

        loadJson(oembedUrl).then(function(jsonData) {
            console.log(jsonData);

            var imgUrl = String(jsonData.thumbnail_url);
            var splits = imgUrl.split('/');
            let newId = splits[4];

            var iframe = document.getElementById('api-frame');
            var version = '1.0.0';
            var client = new Sketchfab(version, iframe);

            client.init(newId, {
                success: function onSuccess(api) {
                    api.start();
                    api.addEventListener('viewerready', function () {

                        self.setState({_api: api});
                        // API is ready to use
                        // Insert your code here
                        console.log('Viewer is ready');

                        self.state._api.addEventListener('annotationFocus', function(index) {
                            this.props.handler(index);
                        }.bind(self));

                        self.state._api.addEventListener('annotationSelect', function(index) {
                            self.props.select(index);
                        }.bind(self));


                    }.bind(self));
                }.bind(self),
                error: function onError() {
                    console.log('Viewer error');
                }
            });

        }).otherwise(function(error) {
            console.log("ERROR");
        });


    },

    render() {

        return (
            <div className={Styles.dataExplorer}>
                <iframe src="" id="api-frame" allowFullScreen mozallowfullscreen="true" webkitallowfullscreen="true" width="100%" height="100%" style={{border: 'none'}}/>
            </div>
        )
    },
});

module.exports = SketchComp;
