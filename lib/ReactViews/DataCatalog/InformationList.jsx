import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import defined from 'terriajs-cesium/Source/Core/defined';

import InformationProperty from './InformationProperty.jsx';
import ObserveModelMixin from '../ObserveModelMixin';
import SearchHeader from '../Search/SearchHeader.jsx';

import Styles from './information-list.scss';

// Displays all the properties of an object in a list
const InformationList = createReactClass({
    displayName: 'InformationList',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object,
        items: PropTypes.object
    },

    render() {
        let properties = [];
        let rejectedProperties = ["dcTitle", "resources", "sourcePage", "sourceData", "sourceRepositorie"];
        //Push all necessary properties into the list
        Object.keys(this.props.items).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object

            if(!rejectedProperties.includes(key))
            properties.push(key);

        });

        return (
            <ul className={Styles.informationlist}>
                <For each="item" of={properties}>
                    <InformationProperty item={item} viewState={this.props.viewState} key={item}
                    />
                </For>
            </ul>
        );
    },
});

module.exports = InformationList;
