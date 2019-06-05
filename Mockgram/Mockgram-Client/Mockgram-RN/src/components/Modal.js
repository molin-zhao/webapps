import React from "react";
import { Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";

export default class Modal extends React.Component {
  static defaultProps = {
    style: {
      width: window.width,
      height: window.height * 0.2
    },
    visible: false,
    animationTiming: 200
  };

  static propTypes = {
    style: PropTypes.object,
    visible: PropTypes.bool,
    animationTiming: PropTypes.number
  };

  constructor(props) {
    super(props);
    let initVisibility = this.props.visible;
    this.state = {
      bottom: new Animated.Value(
        initVisibility === false ? -this.props.style.height : 0
      )
    };
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible) {
      if (visible) {
        this._showModal();
      } else {
        this._hideModal();
      }
    }
  }

  _showModal = () => {
    const { animationTiming } = this.props;
    Animated.timing(this.state.bottom, {
      toValue: 0,
      duration: animationTiming
    }).start();
  };

  _hideModal = () => {
    const { animationTiming, style } = this.props;
    Animated.timing(this.state.bottom, {
      toValue: -style.height,
      duration: animationTiming
    }).start();
  };

  render() {
    const { children, style } = this.props;
    return (
      <Animated.View
        style={[styles.modal, { bottom: this.state.bottom }, style]}
      >
        {children}
      </Animated.View>
    );
  }

  // public method
  slideToPosition = (height, duration) => {
    const { visible } = this.props;
    if (visible) {
      Animated.timing(this.state.bottom, {
        toValue: height,
        duration: duration
      }).start();
    }
  };
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute"
  }
});
