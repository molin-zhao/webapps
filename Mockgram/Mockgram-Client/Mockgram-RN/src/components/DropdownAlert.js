import React from "react";
import { Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Constants } from "expo";
import window from "../utils/getDeviceInfo";
import theme from "../common/theme";

const ANIMATION_DIRECTION = {
  SLIDE_IN_DOWN: "SlideInDown",
  SLIDE_IN_UP: "SlideInUp"
};
class DropdownAlert extends React.Component {
  static defaultProps = {
    containerStyle: {
      width: window.width,
      height: window.height * 0.05
    },
    animationDuration: 300,
    animationDirection: ANIMATION_DIRECTION.SLIDE_IN_DOWN,
    timeout: 2000
  };

  static propTypes = {
    containerStyle: PropTypes.object,
    animationDuration: PropTypes.number,
    animationDirection: PropTypes.string,
    timeout: PropTypes.number
  };

  constructor(props) {
    super(props);
    this._timer = null;
    const { containerStyle } = this.props;
    this.state = {
      top: new Animated.Value(-containerStyle.height),
      bottom: new Animated.Value(-containerStyle.height),
      visible: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  renderAnchor = () => {
    const { animationDirection } = this.props;
    if (animationDirection === ANIMATION_DIRECTION.SLIDE_IN_DOWN) {
      return { top: this.state.top };
    } else {
      return { bottom: this.state.bottom };
    }
  };

  render() {
    const { containerStyle } = this.props;
    return (
      <Animated.View
        style={[styles.container, containerStyle, this.renderAnchor()]}
      >
        {this.props.children}
      </Animated.View>
    );
  }

  // public method
  show = () => {
    const { top, bottom, visible } = this.state;
    if (!visible) {
      this.setState(
        {
          visible: true
        },
        () => {
          const { animationDuration, timeout, animationDirection } = this.props;
          if (animationDirection === ANIMATION_DIRECTION.SLIDE_IN_DOWN) {
            Animated.timing(top, {
              toValue: 0,
              duration: animationDuration
            }).start();
          } else {
            Animated.timing(bottom, {
              toValue: Constants.statusBarHeight,
              duration: animationDuration
            }).start();
          }
          this._timer = setTimeout(this.hide, timeout);
        }
      );
    }
    return;
  };

  hide = () => {
    clearTimeout(this._timer);
    const { top, bottom, visible } = this.state;
    if (visible) {
      this.setState(
        {
          visible: false
        },
        () => {
          const {
            animationDuration,
            containerStyle,
            animationDirection
          } = this.props;
          if (animationDirection === ANIMATION_DIRECTION.SLIDE_IN_DOWN) {
            Animated.timing(top, {
              toValue: -containerStyle.height,
              duration: animationDuration
            }).start();
          } else {
            Animated.timing(bottom, {
              toValue: -containerStyle.height,
              duration: animationDuration
            }).start();
          }
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
