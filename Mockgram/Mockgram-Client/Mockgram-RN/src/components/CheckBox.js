import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";

import theme from "../common/theme";

class CheckBox extends React.Component {
  static defaultProps = {
    iconLeftChecked: () => (
      <Icon name="ios-checkmark-circle" size={theme.iconMd} color="green" />
    ),
    iconLeftUnchecked: () => (
      <Icon name="ios-radio-button-off" size={theme.iconMd} color="lightgrey" />
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

  renderLeftIcon = () => {
    const { iconLeftChecked, iconLeftUnchecked, checked } = this.props;
    if (checked) {
      return iconLeftChecked();
    }
    return iconLeftUnchecked();
  };

  renderRightIcon = () => {
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
        {this.renderLeftIcon()}
        <View style={[styles.titleContainerStyle, titleContainerStyle]}>
          <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
        </View>
        {this.renderRightIcon()}
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
    fontSize: 14,
    color: "grey"
  }
});

export default CheckBox;
