import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import InformationList from '../../DataCatalog/InformationList.jsx';
import DataPreview from '../../Preview/DataPreview.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';
import SearchBox from '../../Search/SearchBox.jsx';

import Styles from './data-catalog-tab.scss';

// The DataCatalog Tab
const InformationTab = createReactClass({
    displayName: 'InformationTab',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.object,
        searchPlaceholder: PropTypes.string
    },

    getDefaultProps() {
        return {
            searchPlaceholder: 'Search item information' // Let SearchBox set the default placeholder
        };
    },

    changeSearchText(newText) {
        this.props.viewState.searchState.catalogSearchText = newText;
    },

    search() {
        this.props.viewState.searchState.searchCatalog();
    },

    render() {
        const terria = this.props.terria;
        return (
            <div className={Styles.root}>
                <div className={Styles.dataExplorer}>
                    <SearchBox searchText={this.props.viewState.searchState.catalogSearchText}
                               onSearchTextChanged={this.changeSearchText}
                               onDoSearch={this.search}
                               placeholder={this.props.searchPlaceholder}/>
                    <InformationList terria={this.props.terria}
                                 viewState={this.props.viewState}
                                 items={this.props.items} />
                </div>
                <DataPreview terria={terria}
                             viewState={this.props.viewState}
                             previewed={this.props.viewState.previewedItem}
                />
            </div>
        );
    },
});

module.exports = InformationTab;
