import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ViewMoreText from "react-native-view-more-text";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import Thumbnail from "./Thumbnail";
import CreatorTag from "./CreatorTag";
import baseUrl from "../common/baseUrl";
import theme from "../common/theme";
import { numberConverter, dateConverter } from "../utils/unitConverter";

class CommentListCellMetaReplyCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource
    };
  }

  handleLikeMeta = () => {
    const { client, navigation } = this.props;
    const { dataSource } = this.state;
    if (client && client.token) {
      const url = `${baseUrl.api}/post/comment/reply/liked`;
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: client.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          replyId: dataSource._id,
          postId: dataSource.postId,
          addLike: !dataSource.liked
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.status === 200) {
            dataSource.likeCount = dataSource.liked
              ? dataSource.likeCount - 1
              : dataSource.likeCount + 1;
            dataSource.liked = !dataSource.liked;
            this.setState({
              dataSource: dataSource
            });
          }
        });
    } else {
      navigation.navigate("Auth");
    }
  };

  render() {
    const { dataSource } = this.state;
    const { creatorId } = this.props;
    return (
      <View key={dataSource._id} style={styles.replyContainer}>
        <View style={styles.replyContents}>
          <View style={styles.username}>
            <Thumbnail
              source={dataSource.from.avatar}
              style={{ width: 16, height: 16 }}
            />
            <Text style={{ marginLeft: 3, fontWeight: "bold", fontSize: 12 }}>
              {dataSource.from.username}
            </Text>
            <CreatorTag byCreator={dataSource.from._id === creatorId} />
            <Ionicons
              name="md-arrow-dropright"
              style={{ marginLeft: 3, color: "grey" }}
            />
            <Text style={{ marginLeft: 3, fontWeight: "bold", fontSize: 12 }}>
              {dataSource.to.username}
            </Text>
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
                width: "30%",
                height: "100%",
                position: "absolute",
                right: 0,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.commentMetaIonicons}
              >
                <Ionicons
                  name="ios-thumbs-up"
                  style={{
                    color: dataSource.liked ? theme.primaryColor : "grey"
                  }}
                  onPress={() => {
                    this.handleLikeMeta();
                  }}
                />
                <Text style={{ color: "grey", fontSize: 12 }}>
                  {numberConverter(dataSource.likeCount)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(withNavigation(CommentListCellMetaReplyCell));

const styles = StyleSheet.create({
  replyContainer: {
    width: "85%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "15%"
  },
  replyContents: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "98%"
  },
  username: {
    width: "98%",
    height: 20,
    marginTop: 10,
    flexDirection: "row",
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
  commentMetaIonicons: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "3%"
  }
});
