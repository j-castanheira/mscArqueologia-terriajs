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

    render() {
        const terria = this.props.terria;
        return (
            <div className={Styles.root}>
                <div className={Styles.dataExplorer}>
                    <SketchComp urlid="555575d8442342d4bd2f5f79c89b8a40" />
                </div>
                HELLO HOW ARE YOU
            </div>
        );
    },
});

module.exports = ExploreTab;
