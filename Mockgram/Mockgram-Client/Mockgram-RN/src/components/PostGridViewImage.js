import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import window from "../utils/getDeviceInfo";
import { numberConverter } from "../utils/unitConverter";

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
          backgroundColor: null,
          width: "95%",
          height: "95%"
        }}
      >
        <Image
          source={{ uri: dataSource.image }}
          style={{ width: "100%", height: "100%" }}
        />
        {/* {
                    dataSource.image ?
                        this.renderMetaIonicons('ios-photos', { top: '5%', right: '5%' }) : null
                } */}
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
