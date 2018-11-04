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
        urlid: PropTypes.string,
        handler: PropTypes.func,
        select: PropTypes.func
    },

    getInitialState(){
        return{
            _api: null
        };
    },

    componentDidMount(){
        var iframe = document.getElementById('api-frame');
        var version = '1.0.0';
        var client = new Sketchfab(version, iframe);

        client.init(this.props.urlid, {
            success: function onSuccess(api) {
                api.start();
                api.addEventListener('viewerready', function () {

                    this.setState({_api: api});
                    // API is ready to use
                    // Insert your code here
                    console.log('Viewer is ready');

                    this.state._api.addEventListener('annotationFocus', function(index) {
                        this.props.handler(index);
                    }.bind(this));

                    this.state._api.addEventListener('annotationSelect', function(index) {
                        this.props.select(index);
                    }.bind(this));


                }.bind(this));
            }.bind(this),
            error: function onError() {
                console.log('Viewer error');
            }
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
