'use strict';

import ObserveModelMixin from '../ObserveModelMixin';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Styles from './mappable-preview.scss';

/**
 * Information preview section
 */
const InformationPreview = createReactClass({
    displayName: 'InformationPreview',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object,
        previewed: PropTypes.string
    },

    getInfo(info)
    {
        let infoList = '';
        let i,j;
        if(info !=undefined) {
            for (i = 0; i < info.length; i++) {
                if (info[i].language === "def" || info[i].language === "en") {
                    var p = info[i].text;
                    if (p != undefined)
                        for (j = 0; j < p.length; j++) {
                            infoList += "<li>" + p[j] + "</li>"
                        }
                }
                else continue
            }
        }

        return infoList;
    },

    goSourcePage()
    {
        window.open(this.props.viewState.currentItem.sourcePage[0]);
    },

    render() {
        const previewed = this.props.previewed;
        const info = this.props.viewState.currentItem[previewed];
        const repository = this.props.viewState.currentItem.sourceRepositorie[0];
        const name = this.props.viewState.currentItem.dcTitle[0].text[0];
        //const image = this.props.viewState.currentItem.resources[0].url;
        console.log(info);
        const infoList = this.getInfo(info);


        console.log(infoList);

        return (
            <div className={Styles.preview}>
                <div className={Styles.root}>
                    <button type='button' onClick={this.goSourcePage}
                            className={Styles.btnAdd}>
                        {'Visit ' + repository + ' page'}
                    </button>
                    <div className={Styles.previewedInfo}>
                        <h3 className={Styles.h3}>{name}</h3>
                        <ul>
                            {infoList}
                        </ul>
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = InformationPreview;
