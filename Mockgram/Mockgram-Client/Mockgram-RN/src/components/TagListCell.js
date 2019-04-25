import React from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";
import { numberConverter } from "../utils/unitConverter";

export default class TagListCell extends React.Component {
  static defaultProps = {
    rightButton: () => null
  };

  static propTypes = {
    rightButton: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { dataSource, onPress, rightButton } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.container}
      >
        <View style={styles.cellLeftContainer}>
          <View style={styles.thumbnail}>
            <Image
              source={require("../static/hashtag.png")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </View>
          <View
            style={{
              width: "80%",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 15, fontWeight: "bold" }}
            >
              {dataSource.name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                style={{ fontSize: 13, color: "lightgrey" }}
              >{`${numberConverter(dataSource.quotedCount)} posts`}</Text>
              <Text
                style={{ fontSize: 13, color: "lightgrey" }}
              >{`${numberConverter(
                dataSource.participantsCount
              )} people used`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cellRightContainer}>{rightButton()}</View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    width: window.width,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  cellLeftContainer: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  cellRightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  thumbnail: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center"
  }
});
