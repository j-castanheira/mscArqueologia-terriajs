'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ObserveModelMixin from '../../ObserveModelMixin';
import Styles from './tool_button.scss';
import Icon from "../../Icon.jsx";

const UploadButton = createReactClass({
    displayName: 'UploadButton',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object
    },

    handleClick() {
        console.log("upload");
    },

    render() {
        return <div className={Styles.toolButton}>
            <button type='button' className={Styles.btn}
                    title='upload a cultural object'
                    onClick={this.handleClick}>
                <Icon glyph={Icon.GLYPHS.upload}/>
            </button>
        </div>;
    },
});

export default UploadButton;
