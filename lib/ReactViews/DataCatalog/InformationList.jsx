import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import defined from 'terriajs-cesium/Source/Core/defined';

import DataCatalogMember from './DataCatalogMember.jsx';
import ObserveModelMixin from '../ObserveModelMixin';
import SearchHeader from '../Search/SearchHeader.jsx';

import Styles from './data-catalog.scss';

// Displays the data catalog.
const InformationList = createReactClass({
    displayName: 'InformationList',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.object
    },

    render() {
        const searchState = this.props.viewState.searchState;
        const isSearching = searchState.catalogSearchText.length > 0;
        /**const items = (
            isSearching ?
                searchState.catalogSearchProvider.searchResults.map(result => result.catalogItem) :
                this.props.items
        ).filter(defined);**/
        console.log("ITESM", this.prop.items);
        let items = [];
        Object.keys(this.props.items).forEach(function(key,index) {
            items.add(key);
            // key: the name of the object key
            // index: the ordinal position of the key within the object
        });

        return (
            <ul className={Styles.dataCatalog}>
                <If condition={isSearching}>
                    <label className={Styles.label}>Search results</label>
                    <SearchHeader searchProvider={searchState.catalogSearchProvider}
                                  isWaitingForSearchToStart={searchState.isWaitingToStartCatalogSearch}/>
                </If>
                <For each="item" of={items}>
                    {item}
                </For>
            </ul>
        );
    },
});

module.exports = InformationList;
