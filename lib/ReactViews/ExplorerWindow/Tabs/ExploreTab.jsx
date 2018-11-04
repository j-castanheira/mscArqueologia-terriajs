import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import InformationList from '../../DataCatalog/InformationList.jsx';
import InformationPreview from '../../Preview/InformationPreview.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';

import Styles from './explore-tab.scss';
import SketchComp from './SketchComp';
import YouTube from 'react-youtube';

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
            currentAnot: null,
            selectedAnot: null
        };
    },

    changeAnot(index) {
        this.setState({currentAnot: index});
        console.log("CHANGE",index);
    },

    selectAnot(index) {
        this.setState({selectedAnot: index});
        console.log("SELECT",index);
    },

    render() {
        const videoIds = ['IsD_BOg7N6k', 'f_RzROQZPgE', 'QdkaGFiDMhI', 'hZAlFx5Xndg', 'SpVFVn-nfrw'];
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
                    <SketchComp urlid="555575d8442342d4bd2f5f79c89b8a40"
                                handler={this.changeAnot} select={this.selectAnot}/>
                </div>
                <div className={Styles.tabright}>
                    {this.state.currentAnot == null ? (
                        <div>
                            <h1>Newgrange</h1>
                            <p>Newgrange, the best known Irish passage tomb, is surrounded by a kerb of 97 stones, the most impressive of which is the highly decorated Entrance Stone. The mound covers a single tomb consisting of a long passage and a cross-shaped chamber. There are the remains of two smaller tombs immediately to the west of Newgrange and at least one and probably two to the east. Newgrange was excavated between 1962 and 1975 by Professor M. J. O’Kelly who discovered the Roof Box through which the mid-winter sun penetrates into the chamber. Based on archaeological evidence, he also designed the reconstruction of the white quartz façade.</p>
                            <p>The great mound of Newgrange, 85m in max. dim. and 11m H, is delimited by a megalithic kerb. It covers a cruciform passage-tomb, 24m long, opening to SE. The chamber is roofed with a fine corbelled vault. There are two stone basins in NE recess; the others contain single basins. The 'roof box' above, some 2.4m back from the passage entrance, permits rays of the rising sun at midwinter solstice to penetrate to the chamber. Many of the kerb stones and a great number of the structural stones of the passage and chamber bear megalighic art. A circle of standing stones surrounds the mound, and three small passage-tombs are in close proximity to it.</p>
                        </div>
                        ) : ""}
                    {this.state.currentAnot == 0 ? (
                        <div id="annotation-entrance"
                             className={this.state.currentAnot == 0 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <img style={{width: '100%', height: 'auto'}}
                                 src="https://proxy.europeana.eu/2048705/object_HA_1502?api_url=https%3A%2F%2Fwww.europeana.eu%2Fapi&view=http%3A%2F%2Fwww.3dicons.ie%2Fimages%2FCONTENT%2FSITES%2FBRUNABOINNE%2FNEWGRANGE%2FNEWGRANGE_ENTRANCESTONE%2FNEW_ENTRANCESTONE_PHOTO.jpg"
                                 alt=""></img>
                        </div>) : ""}
                    {this.state.currentAnot == 1 ? (
                        <div id="annotation-passage"
                             className={this.state.currentAnot == 1 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <img style={{width: '100%', height: 'auto'}}
                                 src="https://proxy.europeana.eu/2048705/object_HA_1539?api_url=https%3A%2F%2Fwww.europeana.eu%2Fapi&view=http%3A%2F%2Fwww.3dicons.ie%2Fimages%2FCONTENT%2FSITES%2FBRUNABOINNE%2FNEWGRANGE%2FNEWGRANGE_TLS%2FNEW_CHAMBER_PHOTO3.jpg"
                                 alt=""></img>
                        </div>) : ""}

                    {this.state.currentAnot == 2 ? (
                        <div id="annotation-kerbstone52"
                             className={this.state.currentAnot == 2 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <img style={{width: '100%', height: 'auto'}}
                                 src="https://proxy.europeana.eu/2048705/object_HA_1476?api_url=https%3A%2F%2Fwww.europeana.eu%2Fapi&view=http%3A%2F%2Fwww.3dicons.ie%2Fimages%2FCONTENT%2FSITES%2FBRUNABOINNE%2FNEWGRANGE%2FNEWGRANG_KS_52%2FNEW_KS_52_PHOTO.jpg"
                                 alt=""></img>
                        </div>) : ""}

                    {this.state.currentAnot == 3 ? (
                        <div id="annotation-kerbstone67"
                             className={this.state.currentAnot == 3 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <img style={{width: '100%', height: 'auto'}}
                                 src="https://proxy.europeana.eu/2048705/object_HA_1609?api_url=https%3A%2F%2Fwww.europeana.eu%2Fapi&view=http%3A%2F%2Fwww.3dicons.ie%2Fimages%2FCONTENT%2FSITES%2FBRUNABOINNE%2FNEWGRANGE%2FNEWGRANGE_KS_67%2FNEW_KS_67_PHOTO.jpg"
                                 alt=""></img>
                        </div>) : ""}
                    {this.state.currentAnot == 4 ? (
                        <div id="annotation-otrosthat"
                             className={this.state.currentAnot == 4 ? Styles.slideactive : Styles.slide}>
                            <YouTube
                                videoId={videoIds[this.state.currentAnot]}
                                opts={opts}
                            />
                            <img style={{width: '100%', height: 'auto'}}
                                 src="https://proxy.europeana.eu/2058619/object_DP_7921860?api_url=https%3A%2F%2Fwww.europeana.eu%2Fapi&view=https%3A%2F%2Frsai.locloudhosting.net%2Ffiles%2Foriginal%2Fafc9bb05fedc2df99813eb0ccc293e1e.jpg"
                                 alt=""></img>
                        </div>) : ""}
                </div>
                <div className={Styles.clear}></div>
            </div>
        );
    },
});

module.exports = ExploreTab;
