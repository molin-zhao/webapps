import React from "react";
import { StyleSheet, Animated } from "react-native";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";

const ANIMATION_DIRECTION = {
  RIGHT: "right",
  LEFT: "left"
};

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false,
      right: new Animated.Value(-this.props.containerStyle.width),
      left: new Animated.Value(-this.props.containerStyle.width)
    };
  }
  static defaultProps = {
    containerStyle: {
      width: window.width * 0.45
    },
    drawerType: ANIMATION_DIRECTION.RIGHT,
    animationDuration: 300
  };

  static propTypes = {
    containerStyle: PropTypes.object,
    drawerType: PropTypes.string,
    animationDuration: PropTypes.number
  };

  renderAnchor = () => {
    const { drawerType } = this.props;
    if (drawerType === ANIMATION_DIRECTION.RIGHT) {
      return { right: this.state.right };
    }
    return { left: this.state.left };
  };

  render() {
    const { containerStyle, children } = this.props;
    return (
      <Animated.View
        style={[styles.container, containerStyle, this.renderAnchor()]}
      >
        {children}
      </Animated.View>
    );
  }

  isDrawerOpen = () => this.state.isDrawerOpen;

  openDrawer = () => {
    const { isDrawerOpen } = this.state;
    if (!isDrawerOpen) {
      // open drawer
      this.setState(
        {
          isDrawerOpen: true
        },
        () => {
          const { drawerType, animationDuration } = this.props;
          if (drawerType === ANIMATION_DIRECTION.RIGHT) {
            Animated.timing(this.state.right, {
              toValue: 0,
              duration: animationDuration
            }).start();
          } else {
            Animated.timing(this.state.left, {
              toValue: 0,
              duration: animationDuration
            });
          }
        }
      );
    }
  };

  closeDrawer = () => {
    const { isDrawerOpen } = this.state;
    if (isDrawerOpen) {
      // close drawer
      this.setState(
        {
          isDrawerOpen: false
        },
        () => {
          const { drawerType, animationDuration, containerStyle } = this.props;
          if (drawerType === "right") {
            Animated.timing(this.state.right, {
              toValue: -containerStyle.width,
              duration: animationDuration
            }).start();
          } else {
            Animated.timing(this.state.left, {
              toValue: -containerStyle.width,
              duration: animationDuration
            }).start();
          }
        }
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default Drawer;
