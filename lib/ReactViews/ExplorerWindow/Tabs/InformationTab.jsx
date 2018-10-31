import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import InformationList from '../../DataCatalog/InformationList.jsx';
import InformationPreview from '../../Preview/InformationPreview.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';

import Styles from './information-tab.scss';

// The Information Tab, to see all properties of an object
const InformationTab = createReactClass({
    displayName: 'InformationTab',
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
                    <InformationList terria={this.props.terria}
                                 viewState={this.props.viewState}
                                 items={this.props.items} />
                </div>
                <InformationPreview terria={terria}
                             viewState={this.props.viewState}
                             previewed={this.props.viewState.currentPropertyPreview}
                />
            </div>
        );
    },
});

module.exports = InformationTab;
