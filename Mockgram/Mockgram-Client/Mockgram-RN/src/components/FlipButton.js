import React from "react";
import { TouchableOpacity, Text, Animated, StyleSheet } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";

class FilpButton extends React.Component {
  value = 0;
  constructor(props) {
    super(props);
    this.state = {
      animatedValue: new Animated.Value(0)
    };
  }
  static defaultProps = {
    containerStyle: {
      width: window.width * 0.1,
      height: window.width * 0.1
    },
    onValueChange: () => null,
    renderFrontLabel: () => null,
    renderFrontText: () => (
      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 10 }}>
        Front
      </Text>
    ),
    renderBackLabel: () => null,
    renderBackText: () => (
      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 10 }}>
        Back
      </Text>
    )
  };

  static propTypes = {
    containerStyle: PropTypes.object,
    onValueChange: PropTypes.func,
    renderFrontLabel: PropTypes.func,
    renderFrontText: PropTypes.func,
    renderBackLabel: PropTypes.func,
    renderBackText: PropTypes.func
  };

  componentDidMount() {
    this.state.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
  }

  render() {
    const {
      containerStyle,
      renderFrontLabel,
      renderFrontText,
      renderBackLabel,
      renderBackText
    } = this.props;
    const { animatedValue } = this.state;
    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ["0deg", "180deg"]
          })
        }
      ]
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ["180deg", "360deg"]
          })
        }
      ]
    };

    const frontOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [89, 90],
        outputRange: [1, 0]
      })
    };

    const backOpacity = {
      opacity: animatedValue.interpolate({
        inputRange: [89, 90],
        outputRange: [0, 1]
      })
    };

    return (
      <TouchableOpacity
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent"
          },
          containerStyle
        ]}
        onPress={() => {
          this.flip();
        }}
        activeOpacity={1}
      >
        <Animated.View
          style={[styles.container, frontAnimatedStyle, frontOpacity]}
        >
          {renderFrontLabel()}
          {renderFrontText()}
        </Animated.View>
        <Animated.View
          style={[
            backAnimatedStyle,
            styles.container,
            styles.containerBack,
            backOpacity
          ]}
        >
          {renderBackLabel()}
          {renderBackText()}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  flip = () => {
    const { onValueChange } = this.props;
    if (this.value >= 90) {
      Animated.spring(this.state.animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10
      }).start();
    } else {
      Animated.spring(this.state.animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10
      }).start();
    }
    return onValueChange();
  };
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden"
  },
  containerBack: {
    position: "absolute",
    top: 0,
    left: 0
  }
});

export default connect(
  mapStateToProps,
  null
)(FilpButton);
