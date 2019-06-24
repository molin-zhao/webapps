import React from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import window from "../utils/getDeviceInfo";
import { locale } from "../common/locale";
import { numberConverter } from "../utils/unitConverter";

class TagListCell extends React.Component {
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
    const { dataSource, onPress, rightButton, appLocale } = this.props;
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
              style={{ width: 30, height: 30, borderRadius: 15 }}
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
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 13, color: "lightgrey" }}
            >{`${numberConverter(dataSource.quotedCount)} ${
              locale[appLocale]["POSTS"]
            }, ${numberConverter(dataSource.participantsCount)} ${
              locale[appLocale]["PARTICIPANTS"]
            }`}</Text>
          </View>
        </View>
        <View style={styles.cellRightContainer}>{rightButton()}</View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(TagListCell);

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
