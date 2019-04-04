import React from "react";
import { Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

export default class Thumbnail extends React.Component {
  static defaultProps = {
    style: { width: 50, height: 50 }
  };

  static propTypes = {
    style: PropTypes.object
  };

  render() {
    const { style, onPress, source } = this.props;
    return (
      <TouchableOpacity style={style} activeOpacity={0.7} onPress={onPress}>
        <Image
          style={[style, { borderRadius: style.height / 2 }]}
          source={source}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }
}
