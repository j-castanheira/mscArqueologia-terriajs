import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import InformationList from '../../DataCatalog/InformationList.jsx';
import InformationPreview from '../../Preview/InformationPreview.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';

import Styles from './explore-tab.scss';
import SketchComp from './SketchComp';

// The Explore Tab, to visualize and interact with a 3D model and related objects
const ExploreTab = createReactClass({
    displayName: 'ExploreTab',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.object,
    },

    getInitialState(){
        return{
            currentAnot: null
        };
    },

    changeAnot(index){
        this.setState({currentAnot: index});
        console.log(index);
    },

    render() {
        const terria = this.props.terria;
        return (
            <div className={Styles.root}>
                    <SketchComp urlid="555575d8442342d4bd2f5f79c89b8a40" anot = {this.state.currentAnot} handler={this.changeAnot} />
                <div className={Styles.slides}>
                    <div id="annotation-0" className={ this.state.currentAnot == 0 ? Styles.slideactive : Styles.slide}>
                        <img style={{widht: '100%', height: 'auto'}} src="https://www.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fwww.3dicons.ie%2Fimages%2FCONTENT%2FSITES%2FBRUNABOINNE%2FNEWGRANGE%2FNEWGRANG_KS_52%2FNEW_KS_52_FRONT.jpg&size=LARGE&type=IMAGE" alt=""></img>
                        <p>
                            Imagem 1
                        </p>
                    </div>
                    <div id="annotation-1" className={this.state.currentAnot == 1 ? Styles.slideactive : Styles.slide}>
                        <img style={{widht: '100%', height: 'auto'}} src="https://www.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fwww.3dicons.ie%2Fimages%2FCONTENT%2FSITES%2FBRUNABOINNE%2FNEWGRANGE%2FNEWGRANGE_ENTRANCESTONE%2FNEWGRANGE_ENTRANCESTONE.jpg&size=LARGE&type=VIDEO" alt=""></img>
                            <p>
                               Imagem 2
                            </p>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = ExploreTab;
