import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import ViewMoreText from "react-native-view-more-text";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import Thumbnail from "./Thumbnail";
import CreatorTag from "./CreatorTag";

import theme from "../common/theme";
import { dateConverter, numberConverter } from "../utils/unitConverter";

class CommentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource
    };
  }

  render() {
    const { dataSource } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.comment}>
        <View style={styles.commentUserAvatar}>
          <Thumbnail
            source={dataSource.commentBy.avatar}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <View style={styles.commentContentWrapper}>
          <View style={styles.commentUsername}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              {dataSource.commentBy.username}
            </Text>
            <CreatorTag byCreator={dataSource.commentByPostCreator} />
          </View>
          <View style={styles.commentContents}>
            <ViewMoreText
              numberOfLines={1}
              renderViewMore={onPress => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onPress}
                    style={{
                      marginTop: 2,
                      height: 15,
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-start"
                    }}
                  >
                    <Text
                      style={{ color: theme.primaryBlue }}
                      onPress={onPress}
                    >
                      {`show more `}
                      <Ionicons name="md-arrow-dropdown" />
                    </Text>
                  </TouchableOpacity>
                );
              }}
              renderViewLess={onPress => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onPress}
                    style={{
                      marginTop: 2,
                      height: 15,
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-start"
                    }}
                  >
                    <Text style={{ color: theme.primaryBlue }}>
                      {`show less `}
                      <Ionicons name="md-arrow-dropup" />
                    </Text>
                  </TouchableOpacity>
                );
              }}
            >
              <Text style={{ fontWeight: "normal" }}>{dataSource.content}</Text>
            </ViewMoreText>
          </View>
          <View style={styles.commentMeta}>
            <Text style={{ fontSize: 12, color: "grey" }}>
              {dateConverter(dataSource.createdAt)}
            </Text>
            <View
              style={{
                width: "20%",
                height: "100%",
                position: "absolute",
                right: "5%",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.commentMetaIonicons}
                onPress={() => {
                  navigation.push("LikedUser", {
                    dataSource: dataSource._id
                  });
                }}
              >
                <Text
                  style={{ color: "grey", fontSize: 12 }}
                >{`${numberConverter(dataSource.likeCount)} liked`}</Text>
                <Ionicons name="ios-arrow-forward" color="grey" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(CommentDetail);

const styles = StyleSheet.create({
  comment: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  commentUserAvatar: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center"
  },
  commentContentWrapper: {
    width: "85%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  commentContents: {
    width: "98%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  commentMeta: {
    width: "98%",
    height: 20,
    marginTop: 2,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  commentUsername: {
    width: "98%",
    height: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  commentMetaIonicons: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row"
  }
});
