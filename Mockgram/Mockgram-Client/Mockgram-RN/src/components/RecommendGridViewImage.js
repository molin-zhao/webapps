import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";

import window from "../utils/getDeviceInfo";
import { numberConverter } from "../utils/unitConverter";
import theme from "../common/theme";

class RecommendGridViewImage extends React.Component {
  renderMetaIcon = (name, style, text = null) => {
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
        <Icon name={name} size={14} color="#fff" />
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
          backgroundColor: theme.primaryGrey,
          width: "95%",
          height: "95%",
          borderColor: "black",
          borderWidth: 0.5,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5
        }}
      >
        <Image
          source={{ uri: dataSource.image }}
          style={{ width: "95%", height: "95%", borderRadius: 5 }}
        />
        {/* {
                    dataSource.image ?
                        this.renderMetaIcon('ios-photos', { top: '5%', right: '5%' }) : null
                } */}
        {/* {this.renderMetaIcon(
          "md-heart",
          { bottom: "5%", left: "5%" },
          numberConverter(dataSource.likeCount)
        )}
        {this.renderMetaIcon(
          "ios-chatbubbles",
          { bottom: "5%", right: "5%" },
          numberConverter(dataSource.commentCount)
        )} */}
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
          alignItems: "center"
        }}
      >
        {this.renderImage()}
      </View>
    );
  }
}

export default withNavigation(RecommendGridViewImage);
