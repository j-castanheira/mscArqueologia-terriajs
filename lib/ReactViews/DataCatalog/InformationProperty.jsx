import React from 'react';

import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';

import defined from 'terriajs-cesium/Source/Core/defined';

import addedByUser from '../../Core/addedByUser';
import InformationPropertyItem from './InformationPropertyItem';
import getAncestors from '../../Models/getAncestors';
import ObserveModelMixin from '../ObserveModelMixin';
import raiseErrorOnRejectedPromise from '../../Models/raiseErrorOnRejectedPromise';

const STATE_TO_TITLE = {
    loading: 'Loading...',
    remove: 'Remove this item',
    add: 'Add this item. Hold down "shift" to keep the data catalogue open.'
};

// Individual property in the InformationList
const InformationProperty = createReactClass({
    displayName: 'InformationProperty',
    mixins: [ObserveModelMixin],

    propTypes: {
        item: PropTypes.string.isRequired,
        viewState: PropTypes.object.isRequired
    },

    onBtnClicked(event) {
        if (defined(this.props.item.invoke) || this.props.viewState.useSmallScreenInterface) {
            this.setPreviewedItem();
        } else {
            this.toggleEnable(event);
        }
    },

    toggleEnable(event) {
        this.props.item.toggleEnabled();

        // set preview as well
        this.setPreviewedItem();

        if (this.props.item.isEnabled === true && !event.shiftKey && !event.ctrlKey) {
            // close modal window
            this.props.viewState.explorerPanelIsVisible = false;
            this.props.viewState.mobileView = null;
            if (this.props.viewState.firstTimeAddingData) {
                this.props.viewState.featureInfoPanelIsVisible = true;
            }
        }
    },

    setPreviewedItem() {
        //raiseErrorOnRejectedPromise(this.props.item.terria, this.props.item.load());
        this.props.viewState.changePropertyPreview(this.props.item);
        // mobile switch to now vewing
        this.props.viewState.switchMobileView(this.props.viewState.mobileViewOptions.preview);
    },

    isSelected() {
        return this.props.viewState.currentPropertyPreview === this.props.item;
    },

    changeName(name){
      let newName = '';
      switch (String(name))
      {
          case 'dcCreator': newName = "Creator"; break;
          case 'dcDate': newName = "Date"; break;
          case 'dcDescription': newName = "Description"; break;
          case 'dcIdentifier': newName = "Identifier"; break;
          case 'dcSubject': newName = "Subject"; break;
          case 'dcType': newName = "Types"; break;
          case 'locations': newName = "Locations"; break;
          case 'timeSpans': newName = "Time Spans"; break;
          case 'dcFormat': newName = "Format"; break;
          case 'dcPublisher': newName = "Publisher"; break;
          case 'dcContributor': newName = "Contributor"; break;
          case 'termsExtent': newName = "Length"; break;
          case 'termsSpatial': newName = "Spatial"; break;
          case 'termsMedium': newName = "Medium"; break;
          case 'agents': newName = "Agents"; break;
          case 'dcRights': newName = "Rights"; break;
          case 'dcLanguage': newName = "Language"; break;
          case 'dcRelation': newName = "Relation"; break;
          case 'technique': newName = "Technique"; break;
          case 'createdIn': newName = "Created In"; break;

          default:
              newName = name;
              break;

      }

        return newName;
    },

    render() {
        const item = this.props.item
        const name = this.changeName(item);
        return (
            <InformationPropertyItem
                onTextClick={this.setPreviewedItem}
                selected={this.isSelected()}
                text={name}
                title={name}
                btnState={this.getState()}
                onBtnClick={this.onBtnClicked}
                titleOverrides={STATE_TO_TITLE}
            />
        );
    },

    getState() {
        if (this.props.item.isLoading) {
            return 'loading';
        } else if (this.props.viewState.useSmallScreenInterface) {
            return 'preview';
        } else if (this.props.item.isEnabled) {
            return 'remove';
        } else if (!defined(this.props.item.invoke)) {
            return 'add';
        } else {
            return 'stats';
        }
    },
});

module.exports = InformationProperty;
