import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InformationTab from './Tabs/InformationTab.jsx';
import ExploreTab from './Tabs/ExploreTab.jsx';
import ObserveModelMixin from '../ObserveModelMixin';
import defined from 'terriajs-cesium/Source/Core/defined';

import Styles from './infotabs.scss';

const InteractionTabs = createReactClass({
    displayName: 'InteractionTabs',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        tabs: PropTypes.array
    },

    getInitialState(){
        return{
            currentTab: 0
        };
    },

    getTabs() {
        // This can be passed in as prop
        if (this.props.tabs) {
            return this.props.tabs;
        }

        const exploreTab = {
            name: 'Explore',
            title: 'explore',
            category: 'explore',
            tab: 0,
            panel: <ExploreTab terria={this.props.terria}
                                viewState={this.props.viewState}
            />
        };

        const infoTab =
            {
                name: 'Information',
                title: 'information',
                category: 'information',
                tab: 1,
                panel: <InformationTab terria={this.props.terria}
                                       viewState={this.props.viewState}
                                       items={this.props.viewState.currentItem}
                />
            };

            return [exploreTab,infoTab];
    },

    activateTab(tab) {
        this.setState({
            currentTab: tab
        });
    },

    render() {
        const tabs = this.getTabs();
        const currentTab = tabs[this.state.currentTab];
        return (
            <div className={Styles.tabs}>
                <ul className={Styles.tabList} role="tablist">
                    <For each="item" index="i" of={tabs}>
                        <li key={i}
                            id={'tablist--' + item.title}
                            className={Styles.tabListItem}
                            role="tab"
                            aria-controls={'panel--' + item.title}
                            aria-selected={item === currentTab}>
                            <button type='button'
                                    onClick={this.activateTab.bind(this, item.tab)}
                                    className={classNames(Styles.btnTab, {[Styles.btnSelected]: item === currentTab})}>
                                {item.name}
                            </button>
                        </li>
                    </For>
                </ul>

                <section
                    key={currentTab.title}
                    id={'panel--' + currentTab.title}
                    className={classNames(Styles.tabPanel, Styles.isActive)}
                    aria-labelledby={'tablist--' + currentTab.title}
                    role='tabpanel' tabIndex='0'>
                    <div className={Styles.panelContent}>
                        {currentTab.panel}
                    </div>
                </section>
            </div>
        );
    },
});

module.exports = InteractionTabs;
