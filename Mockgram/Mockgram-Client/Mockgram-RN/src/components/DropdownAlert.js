import React from "react";
import { Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";

class DropdownAlert extends React.Component {
  static defaultProps = {
    containerStyle: {
      width: window.width,
      height: window.height * 0.05
    },
    animationDuration: 300,
    timeout: 2000
  };

  static propTypes = {
    containerStyle: PropTypes.object,
    animationDuration: PropTypes.number,
    timeout: PropTypes.number
  };

  constructor(props) {
    super(props);
    this._timer = null;
    this.state = {
      top: new Animated.Value(-this.props.containerStyle.height),
      visible: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  render() {
    const { containerStyle } = this.props;
    const { top } = this.state;
    return (
      <Animated.View style={[styles.container, containerStyle, { top: top }]}>
        {this.props.children}
      </Animated.View>
    );
  }

  // public method
  show = () => {
    const { top, visible } = this.state;
    if (!visible) {
      this.setState(
        {
          visible: true
        },
        () => {
          const { animationDuration, timeout } = this.props;
          Animated.timing(top, {
            toValue: 0,
            duration: animationDuration
          }).start();
          this._timer = setTimeout(this.hide, timeout);
        }
      );
    }
    return;
  };

  hide = () => {
    const { top, visible } = this.state;
    if (visible) {
      this.setState(
        {
          visible: false
        },
        () => {
          const { animationDuration, containerStyle } = this.props;
          Animated.timing(top, {
            toValue: -containerStyle.height,
            duration: animationDuration
          }).start();
        }
      );
    }
    return;
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default DropdownAlert;
