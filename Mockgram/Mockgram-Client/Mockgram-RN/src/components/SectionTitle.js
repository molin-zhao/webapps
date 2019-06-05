import React from "react";
import { View, StyleSheet, Text } from "react-native";
import theme from "../common/theme";
import window from "../utils/getDeviceInfo";
import Proptypes from "prop-types";

export default class SectionTitle extends React.Component {
  static defaultProps = {
    iconLabel: () => null,
    iconRight: () => null,
    label: "Label",
    containerStyle: {
      height: window.height * 0.05,
      backgroundColor: theme.primaryGrey,
      borderBottomColor: "lightgrey",
      borderBottomWidth: 1
    }
  };

  static propTypes = {
    iconLabel: Proptypes.func,
    iconRight: Proptypes.func,
    label: Proptypes.string,

    // style props
    containerStyle: Proptypes.object,
    labelStyle: Proptypes.object
  };
  render() {
    const {
      label,
      labelStyle,
      iconLabel,
      iconRight,
      containerStyle
    } = this.props;
    return (
      <View style={[styles.sectionTitle, containerStyle]}>
        <View style={styles.sectionLabel}>
          {iconLabel()}
          <Text style={[{ marginLeft: 10 }, labelStyle]}>{label}</Text>
        </View>
        <View style={styles.sectionRightLabel}>{iconRight()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%"
  },
  sectionLabel: {
    marginLeft: theme.paddingToWindow,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  sectionRightLabel: {
    marginRight: theme.paddingToWindow,
    justifyContent: "center",
    alignItems: "flex-end"
  }
});
