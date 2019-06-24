import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";

import window from "../utils/getDeviceInfo";
import theme from "../common/theme";
import { locale } from "../common/locale";
import { numberConverter } from "../utils/unitConverter";

class PostListCell extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dataSource, appLocale } = this.props;
    return (
      <View
        style={{
          borderWidth: 0,
          width: window.width,
          height: 80,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Ionicons name="ios-pin" size={theme.iconMd} />
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
            style={{ fontSize: 13, color: "grey" }}
          >{`${dataSource.meta.street}, ${dataSource.meta.city}, ${
            dataSource.meta.region
          }`}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontSize: 13, color: "grey" }}
          >{`${numberConverter(dataSource.quotedCount)} ${
            locale[appLocale]["POSTS"]
          }, ${numberConverter(dataSource.participantsCount)} ${
            locale[appLocale]["PARTICIPANTS"]
          }`}</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(PostListCell);
