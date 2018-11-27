import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ko from 'terriajs-cesium/Source/ThirdParty/knockout';

import ObserveModelMixin from '../ObserveModelMixin';

import Styles from './explorer-window.scss';

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
            isMounted: false
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

    render() {
        const visible = this.state.visible;

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
                        Done
                    </button>
                    FORM
                </div>
            </div>
        ) : null;
    },
});

module.exports = FormWindow;
