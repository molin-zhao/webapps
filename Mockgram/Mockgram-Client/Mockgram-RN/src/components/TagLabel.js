import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import window from "../utils/getDeviceInfo";
import Proptyps from "prop-types";

class TagLabel extends React.Component {
  static defaultProps = {
    label: () => null,
    button: () => null
  };
  static propTypes = {
    label: Proptyps.func,
    button: Proptyps.func
  };

  render() {
    const { labelOnPress, label, button } = this.props;
    return (
      <View style={styles.container}>
        <View style={labelContainer}>
          <View style={{ width: 5, backgroundColor: "transparent" }} />
          <TouchableOpacity onPress={labelOnPress} style={styles.label}>
            {label()}
          </TouchableOpacity>
          {button()}
          <View style={{ width: 5, backgroundColor: "transparent" }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: window.height * 0.05,
    justifyContent: "center",
    alignItems: "center"
  },
  labelContainer: {
    height: "90%",
    borderRadius: 5,
    borderColor: "black",
    backgroundColor: "lightgrey",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  }
});

export default TagLabel;
