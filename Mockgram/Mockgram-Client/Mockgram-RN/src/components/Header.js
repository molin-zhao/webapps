import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Proptypes from "prop-types";
import { Header } from "react-navigation";

export default class CustomHeader extends React.Component {
  static defaultProps = {
    leftIconButton: () => null,
    rightIconButton: () => null,
    headerTitle: "title"
  };

  static propTypes = {
    leftIconButton: Proptypes.func,
    rightIconButton: Proptypes.func,
    titleOnPress: Proptypes.func,
    headerTitle: Proptypes.string
  };

  render() {
    const {
      headerTitle,
      leftIconButton,
      rightIconButton,
      titleOnPress,
      style,
      headerTitleStyle
    } = this.props;
    return (
      <View style={[styles.header, style]}>
        <View style={styles.headerLeft}>{leftIconButton()}</View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerMiddle}
          onPress={titleOnPress}
        >
          <Text style={headerTitleStyle}>{headerTitle}</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>{rightIconButton()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: getStatusBarHeight(),
    height: Header.HEIGHT,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  headerLeft: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1
  },
  headerMiddle: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 3
  },
  headerRight: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flex: 1
  }
});
