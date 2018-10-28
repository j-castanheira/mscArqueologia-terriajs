import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from "../Icon.jsx";

import defaultValue from 'terriajs-cesium/Source/Core/defaultValue';

import Styles from './data-catalog-item.scss';

const STATE_TO_TITLE = {
    loading: 'Loading...',
    remove: 'Remove',
    add: 'Add'
};

const STATE_TO_ICONS = {
    loading: <Icon glyph={Icon.GLYPHS.loader}/>,
    remove: <Icon glyph={Icon.GLYPHS.remove}/>,
    add: <Icon glyph={Icon.GLYPHS.add}/>,
    stats: <Icon glyph={Icon.GLYPHS.barChart}/>,
    preview: <Icon glyph={Icon.GLYPHS.right}/>
};

/** Dumb property item */
function InformationPropertyItem(props) {
    const stateToTitle = defaultValue(props.titleOverrides, STATE_TO_TITLE);
    return (
        <li className={classNames(Styles.root)}>
            <button type='button'
                    onClick={props.onTextClick}
                    title={props.title}
                    className={classNames(
                            Styles.btnCatalogItem,
                            {[Styles.btnCatalogItemIsPreviewed]: props.selected}
                        )}>
                {props.text}
            </button>
        </li>
    );
}

InformationPropertyItem.propTypes = {
    onTextClick: PropTypes.func,
    selected: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
    onBtnClick: PropTypes.func,
    btnState: PropTypes.oneOf(Object.keys(STATE_TO_ICONS)),
    titleOverrides: PropTypes.object
};

export default InformationPropertyItem;
