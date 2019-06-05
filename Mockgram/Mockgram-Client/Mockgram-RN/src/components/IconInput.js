import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";

class IconInput extends React.Component {
  static defaultProps = {
    icon: () => null,
    label: () => null,
    containerStyle: {
      width: window.width * 0.7,
      height: 50,
      marginTop: 35
    }
  };
  static propTypes = {
    icon: PropTypes.func,
    label: PropTypes.func,
    containerStyle: PropTypes.object
  };

  renderLabel = () => {
    const { icon, label } = this.props;
    if (icon()) {
      return <View style={styles.formIcon}>{icon()}</View>;
    } else if (label()) {
      return <View style={styles.formLabel}>{label()}</View>;
    } else {
      return null;
    }
  };

  render() {
    const {
      containerStyle,
      inputStyle,
      textInputContainerStyle,
      ...props
    } = this.props;
    return (
      <View style={[styles.formInput, containerStyle]}>
        {this.renderLabel()}
        <View style={[styles.formInputTextInput, textInputContainerStyle]}>
          <TextInput
            {...props}
            style={[{ fontSize: 14, width: "96%" }, inputStyle]}
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
  formInputTextInput: {
    justifyContent: "center",
    alignItems: "center",
    width: "65%",
    height: "100%",
    marginLeft: "5%"
  },
  formLabel: {
    width: "30%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  formIcon: {
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default IconInput;
