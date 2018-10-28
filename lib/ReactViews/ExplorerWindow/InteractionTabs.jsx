import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import InformationTab from './Tabs/InformationTab.jsx';
import MyDataTab from './Tabs/MyDataTab/MyDataTab.jsx';
import ObserveModelMixin from '../ObserveModelMixin';
import defined from 'terriajs-cesium/Source/Core/defined';

import Styles from './tabs.scss';

const InteractionTabs = createReactClass({
    displayName: 'InteractionTabs',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        tabs: PropTypes.array
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
            panel: <MyDataTab terria={this.props.terria}
                                viewState={this.props.viewState}
            />
        };

        const infoTab =
            {
                name: 'Information',
                title: 'information',
                category: 'information',
                panel: <InformationTab terria={this.props.terria}
                                       viewState={this.props.viewState}
                                       items={this.props.viewState.currentItem}
                                       searchPlaceholder="Search the catalogue"
                />
            };

            return [infoTab,exploreTab];
    },

    activateTab(category, idInCategory) {
        this.props.viewState.activeTabCategory = category;
    },

    render() {
        const tabs = this.getTabs();
        const sameCategory = tabs.filter(t => t.category === this.props.viewState.activeTabCategory);
        const currentTab = sameCategory.filter(t => t.idInCategory === this.props.viewState.activeTabIdInCategory)[0] || sameCategory[0] || tabs[0];
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
                                    onClick={this.activateTab.bind(this, item.category, item.idInCategory)}
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
