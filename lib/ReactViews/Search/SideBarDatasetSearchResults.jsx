import ObserveModelMixin from '../ObserveModelMixin';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import SearchResult from './SearchResult.jsx';
import classNames from 'classnames';
import Icon from "../Icon.jsx";
import Styles from './sidebar-dataset-search-results.scss';

const SideBarDatasetSearchResults = createReactClass({
    displayName: 'SideBarDatasetSearchResults',
    mixins: [ObserveModelMixin],

    propTypes: {
        viewState: PropTypes.object.isRequired,
        terria: PropTypes.object.isRequired,
        theme: PropTypes.string
    },

    getDefaultProps() {
        return {
            theme: "dark"
        };
    },

    getInitialState() {
        return {
            isOpen: true
        };
    },

    searchInDataCatalog() {
        this.props.viewState.searchInCatalog(this.props.viewState.searchState.locationSearchText);
    },

    searchInRepository() {
        this.props.viewState.searchInRepository(this.props.viewState.searchState.locationSearchText,1);
    },


    searchInPersonal() {
        this.props.viewState.searchInRepository(this.props.viewState.searchState.locationSearchText,3);
    },

    toggleGroup() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    },

    render() {
        return (<div key='data'
                     className={classNames(Styles.providerResult, {[Styles.isOpen]: this.state.isOpen, [Styles.dark]: this.props.theme === 'dark', [Styles.light]: this.props.theme === 'light'})}>
                    <button onClick={this.toggleGroup} className={Styles.heading}>
                        <span>Data</span>
                        <Icon glyph={this.state.isOpen ? Icon.GLYPHS.opened : Icon.GLYPHS.closed}/>
                    </button>
                    <ul className={Styles.items}>
                        <SearchResult clickAction={this.searchInRepository}
                                      icon='data'
                                      name={`Search for "${this.props.viewState.searchState.locationSearchText}" in cultural object repositories`}
                        />
                        <SearchResult clickAction={this.searchInPersonal}
                                      icon='data'
                                      name={`Search for "${this.props.viewState.searchState.locationSearchText}" in the personal database of submitted objects`}
                        />
                    </ul>
                </div>);
    },
});

module.exports = SideBarDatasetSearchResults;
