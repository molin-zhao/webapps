import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import ProgressiveImage from "./ProgressiveImage";

import window from "../utils/getDeviceInfo";
import { numberConverter } from "../utils/unitConverter";
import theme from "../common/theme";

class PostGridViewImage extends React.Component {
  renderMetaIonicons = (name, style, text = null) => {
    return (
      <View
        style={[
          {
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          },
          style
        ]}
      >
        <Ionicons name={name} size={14} color="#fff" />
        <Text style={{ fontSize: 12, color: "#fff" }}>{text}</Text>
      </View>
    );
  };
  renderImage = () => {
    const { dataSource, navigation } = this.props;
    if (dataSource.type === "empty") {
      return null;
    }
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.push("PostDetail", {
            _id: dataSource._id
          });
        }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={{ uri: dataSource.image[0].file }}
          style={{
            width: "95%",
            height: "95%",
            backgroundColor: theme.primaryGrey
          }}
        />
        {dataSource.image.length > 1
          ? this.renderMetaIonicons("ios-photos", { top: "5%", right: "5%" })
          : null}
        {this.renderMetaIonicons(
          "md-heart",
          { bottom: "5%", left: "5%" },
          numberConverter(dataSource.likeCount)
        )}
        {this.renderMetaIonicons(
          "ios-chatbubbles",
          { bottom: "5%", right: "5%" },
          numberConverter(dataSource.commentCount)
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const { numColumns, dataSource } = this.props;
    return (
      <View
        key={dataSource._id}
        style={{
          width: window.width / numColumns,
          height: window.width / numColumns,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10
        }}
      >
        {this.renderImage()}
      </View>
    );
  }
}

export default withNavigation(PostGridViewImage);
