import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";

export default class DrawerItem extends React.Component {
  static defaultProps = {
    icon: () => null,
    btnText: () => null,
    onPress: () => null
  };

  static propTypes = {
    icon: PropTypes.func,
    btnText: PropTypes.func,
    onPress: PropTypes.func
  };
  render() {
    const { onPress, icon, btnText } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.drawerItem}
        onPress={onPress}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {icon()}
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          {btnText()}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  drawerItem: {
    height: Math.floor(window.height * 0.08),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});
