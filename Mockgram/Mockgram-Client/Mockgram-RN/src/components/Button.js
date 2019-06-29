import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { SkypeIndicator } from "react-native-indicators";

import theme from "../common/theme";

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    activeOpacity: 0.8,
    containerStyle: {
      backgroundColor: "#fff",
      borderColor: "grey",
      borderWidth: 1
    },
    loadingTitle: "",
    loadingIndicator: () => <SkypeIndicator size={theme.iconSm} color="#fff" />,
    iconLeft: () => null,
    iconRight: () => null,
    loading: false,
    disabled: false
  };

  static propTypes = {
    activeOpacity: PropTypes.number,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,

    //styles
    containerStyle: PropTypes.object,
    titleStyle: PropTypes.object,

    //content
    title: PropTypes.string,
    loadingTitle: PropTypes.string,

    //functions
    iconLeft: PropTypes.func,
    iconRight: PropTypes.func,
    onPress: PropTypes.func,
    loadingIndicator: PropTypes.func
  };

  handleOnPress = () => {
    const { loading, onPress } = this.props;
    if (!loading) {
      return onPress();
    }
    return null;
  };

  renderButtonContent = () => {
    const {
      loading,
      loadingIndicator,
      loadingTitle,
      title,
      titleStyle,
      iconLeft,
      iconRight
    } = this.props;
    if (loading) {
      return (
        <View style={styles.content}>
          {loadingIndicator()}
          {loadingTitle ? (
            <Text style={[styles.title, titleStyle]}>{loadingTitle}</Text>
          ) : null}
        </View>
      );
    }
    return (
      <View style={styles.content}>
        {iconLeft()}
        <Text
          style={[
            styles.title,
            {
              marginLeft: iconLeft() ? 10 : 0,
              marginRight: iconRight() ? 10 : 0
            },
            titleStyle
          ]}
        >
          {title}
        </Text>
        {iconRight()}
      </View>
    );
  };

  render() {
    const { containerStyle, activeOpacity, disabled, loading } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor: disabled
              ? "lightgrey"
              : containerStyle.backgroundColor || theme.primaryColor
          }
        ]}
        onPress={this.handleOnPress}
        activeOpacity={disabled || loading ? 1 : activeOpacity}
      >
        {this.renderButtonContent()}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  },
  title: {
    fontSize: 12,
    color: "black"
  },
  content: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
