import React from "react";
import { Image } from "react-native";
import PropTypes from "prop-types";
import theme from "../common/theme";

export default class Thumbnail extends React.Component {
  static defaultProps = {
    style: { width: 50, height: 50 },
    source: ""
  };

  static propTypes = {
    style: PropTypes.object,
    source: PropTypes.string
  };

  render() {
    const { style, source } = this.props;
    return (
      <Image
        style={[
          style,
          {
            borderRadius: style.borderRadius
              ? style.borderRadius
              : style.height / 2,
            backgroundColor: theme.primaryGrey
          }
        ]}
        source={source ? { uri: source } : require("../static/user.png")}
        resizeMode="cover"
      />
    );
  }
}
