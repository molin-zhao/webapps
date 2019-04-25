import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";

import window from "../utils/getDeviceInfo";

class IconInput extends React.Component {
  static defaultProps = {
    icon: () => <Icon name="user" size={20} />,
    containerStyle: {
      width: window.width * 0.7,
      height: 50,
      marginTop: 35
    }
  };
  static propTypes = {
    icon: PropTypes.func,
    containerStyle: PropTypes.object
  };

  render() {
    const { containerStyle, icon, inputStyle, ...props } = this.props;
    return (
      <View style={[styles.formInput, containerStyle]}>
        <View style={styles.formInputLabel}>{icon()}</View>
        <View style={styles.formInputTextInput}>
          <TextInput
            style={[{ fontSize: 14, width: "100%" }, inputStyle]}
            {...props}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInput: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  formInputLabel: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  formInputTextInput: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 4
  }
});

export default IconInput;
