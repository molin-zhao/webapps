import React from "react";
import { View, Animated, StyleSheet } from "react-native";
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
    this.state = {
      bottom: new Animated.Value(-this.props.style.height)
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
        style={[styles.modal, style, { bottom: this.state.bottom }]}
      >
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute"
  }
});
