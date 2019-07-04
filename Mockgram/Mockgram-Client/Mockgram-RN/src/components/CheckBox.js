import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

import theme from "../common/theme";

class CheckBox extends React.Component {
  static defaultProps = {
    iconLeftChecked: () => (
      <Ionicons name="ios-checkmark-circle" size={theme.iconMd} color="green" />
    ),
    iconLeftUnchecked: () => (
      <Ionicons
        name="ios-radio-button-off"
        size={theme.iconMd}
        color="lightgrey"
      />
    ),
    iconRightChecked: () => null,
    iconRightUnchecked: () => null,
    checked: false
  };

  static propTypes = {
    iconLeftChecked: PropTypes.func,
    iconLeftUnchecked: PropTypes.func,
    iconRightChecked: PropTypes.func,
    iconRightUnchecked: PropTypes.func,

    title: PropTypes.string,

    // style properties
    titleStyle: PropTypes.object,
    titleContainerStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    activeOpacity: PropTypes.number,

    // state properties
    checked: PropTypes.bool,
    onPress: PropTypes.func
  };

  renderLeftIonicons = () => {
    const { iconLeftChecked, iconLeftUnchecked, checked } = this.props;
    if (checked) {
      return iconLeftChecked();
    }
    return iconLeftUnchecked();
  };

  renderRightIonicons = () => {
    const { iconRightChecked, iconRightUnchecked, checked } = this.props;
    if (checked) {
      return iconRightChecked();
    }
    return iconRightUnchecked();
  };

  render() {
    const {
      containerStyle,
      onPress,
      activeOpacity,
      title,
      titleStyle,
      titleContainerStyle
    } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        activeOpacity={activeOpacity}
        onPress={onPress}
      >
        {this.renderLeftIonicons()}
        <View style={[styles.titleContainerStyle, titleContainerStyle]}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.titleStyle, titleStyle]}
          >
            {title}
          </Text>
        </View>
        {this.renderRightIonicons()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  titleContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10
  },
  titleStyle: {
    fontSize: 12,
    color: "grey"
  }
});

export default CheckBox;
