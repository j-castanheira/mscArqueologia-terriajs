import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ko from 'terriajs-cesium/Source/ThirdParty/knockout';

import ObserveModelMixin from '../ObserveModelMixin';

import Styles from './form-window.scss';

const SLIDE_DURATION = 300;

const FormWindow = createReactClass({
    displayName: 'ExplorerWindow',
    mixins: [ObserveModelMixin],

    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            isMounted: false,
            titleValue: "",
            creatorValue: "",
            dateValue: "",
            descriptionValue: "",
            locationValue: "",
            latitudeValue: "",
            longitudeValue: "",
            typeValue: "",
            resourceValue: ""
        };
    },

    close() {
        this.props.viewState.formPanelIsVisible = false;
        this.props.viewState.switchMobileView('nowViewing');
    },

    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
        this.props.viewState.formPanelAnimating = true;

        this._pickedFeaturesSubscription = ko.pureComputed(this.isVisible, this).subscribe(this.onVisibilityChange);
        this.onVisibilityChange(this.isVisible());
    },

    componentDidMount() {
        this.escKeyListener = e => {
            if (e.keyCode === 27) {
                this.close();
            }
        };
        window.addEventListener('keydown', this.escKeyListener, true);
    },

    onVisibilityChange(isVisible) {
        if (isVisible) {
            this.slideIn();
        } else {
            this.slideOut();
        }
    },

    slideIn() {
        this.props.viewState.formPanelAnimating = true;

        this.setState({
            visible: true
        });
        setTimeout(() => {
            this.setState({
                slidIn: true
            });

            setTimeout(() => this.props.viewState.formPanelAnimating = false, SLIDE_DURATION);
        });
    },

    slideOut() {
        this.setState({
            slidIn: false
        });
        setTimeout(() => {
            this.setState({
                visible: false
            });
        }, SLIDE_DURATION);
    },

    componentWillUnmount() {
        window.removeEventListener('keydown', this.escKeyListener, false);

        this._pickedFeaturesSubscription.dispose();
    },

    isVisible() {
        return !this.props.viewState.useSmallScreenInterface && !this.props.viewState.hideMapUi() && this.props.viewState.formPanelIsVisible;
    },

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    },

    render() {
        const visible = this.state.visible;
        const divStyle = {margin: '8px', padding: '8px'};

        return visible ? (
            <div className={Styles.modalWrapper}
                 id="explorer-panel-wrapper"
                 aria-hidden={!visible}>
                <div onClick={this.close}
                     id="modal-overlay"
                     className={Styles.modalOverlay}
                     tabIndex="-1"/>
                <div id="explorer-panel"
                     className={classNames(Styles.explorerPanel, Styles.modalContent, {[Styles.isMounted]: this.state.slidIn})}
                     aria-labelledby="modalTitle"
                     aria-describedby="modalDescription"
                     role="dialog">
                    <button type='button'
                            onClick={this.close}
                            className={Styles.btnCloseModal}
                            title="Close data panel"
                            data-target="close-modal">
                        X
                    </button>
                    <h3 className={Styles.h3}> <p style={divStyle}>Submit an object</p></h3>
                    <div className={Styles.panelContent}>
                            <label><b> Title </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.titleValue}
                                       onChange={this.handleChange}
                                       name="titleValue"
                                />
                            </label>

                            <label><b> Creator </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.creatorValue}
                                       onChange={this.handleChange}
                                       name="creatorValue"
                                />
                            </label>

                            <label><b> Description </b>
                                <textarea className={Styles.field}
                                          value={this.state.descriptionValue}
                                          onChange={this.handleChange}
                                          name="descriptionValue"
                                />
                            </label>

                            <label><b> Date </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.dateValue}
                                       onChange={this.handleChange}
                                       name="dateValue"
                                />
                            </label>
                            <label><b> Location </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.locationValue}
                                       onChange={this.handleChange}
                                       name="locationValue"
                                />
                            </label>

                            <label><b> Latitude </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.latitudeValue}
                                       onChange={this.handleChange}
                                       name="latitudeValue"
                                />
                            </label>

                            <label><b> Longitude </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.longitudeValue}
                                       onChange={this.handleChange}
                                       name="longitudeValue"
                                />
                            </label>

                            <label><b> Type of resource </b>
                                <select className={Styles.field}
                                       value={this.state.typeValue}
                                       onChange={this.handleChange}
                                       name="typeValue">
                                <option value="IMAGE">Image</option>
                                <option value="VIDEO">Video</option>
                                <option value="3D">3D Model</option>
                                <option value="OTHER">Other</option>
                                </select>
                            </label>

                            <label><b> Resource </b>
                                <input className={Styles.field}
                                       type="text"
                                       value={this.state.resourceValue}
                                       onChange={this.handleChange}
                                       name="resourceValue"
                                />
                            </label>
                        <div className={Styles.footer}>
                            <button type='button' className={Styles.btn} onClick={this.submit}>Submit Object</button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    },
});

module.exports = FormWindow;
