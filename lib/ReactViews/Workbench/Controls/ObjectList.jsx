'use strict';

import classNames from 'classnames';
import defined from 'terriajs-cesium/Source/Core/defined';
import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';
import Loader from '../../Loader.jsx';
import ObserveModelMixin from '../../ObserveModelMixin';
import proxyCatalogItemUrl from '../../../Models/proxyCatalogItemUrl';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import URI from 'urijs';
import Styles from './objectList.scss';
import ObjectItem from './ObjectItem';

const ObjectList = createReactClass({
    displayName: 'ObjectList',
    mixins: [ObserveModelMixin],

    propTypes: {
        item: PropTypes.object
    },

    render() {
//EDITED
        console.log("LOADING", this.props.item.isLoading);

        const datasource = this.props.item.dataSource;
        let objects = undefined;
        if(datasource !== undefined)
            objects = datasource._rowObjects;
        if(objects === undefined)
            return false;
        //console.log("OBJECTS",objects);
        //console.log("DATASOURCE",datasource);
        return (
            <ul className={Styles.objectList}>
                <div className={Styles.objectListInner}>
                    <Choose>
                        <When condition={this.props.item.isLoading}>
                            <li className={Styles.loader}><Loader message={this.props.item.loadingMessage}/></li>
                        </When>
                        <Otherwise>
                            {objects.map((object,k) => {
                                return (
                                    <ObjectItem key={k} object={object} list = {this}/>
                                );
                            })}
                        </Otherwise>
                    </Choose>

                </div>
            </ul>
        );
    },
});

module.exports = ObjectList;


