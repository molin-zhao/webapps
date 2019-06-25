import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ViewMoreText from "react-native-view-more-text";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import Thumbnail from "./Thumbnail";
import CreatorTag from "./CreatorTag";

import { dateConverter } from "../utils/unitConverter";
import baseUrl from "../common/baseUrl";
import theme from "../common/theme";
import { locale } from "../common/locale";

class ReplyListCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource
    };
  }

  handleReply = () => {
    const {
      client,
      navigation,
      textInputController,
      dataCallbackController
    } = this.props;
    const { dataSource } = this.state;
    if (client && client.user) {
      // user token is required for a comment or reply
      textInputController.updateMessageReceiver({
        _id: dataSource.from._id,
        username: dataSource.from.username,
        commentId: dataSource.commentId,
        postId: dataSource.postId,
        type: "reply",
        dataCallbackController: dataCallbackController
      });
    } else {
      navigation.navigate("Auth");
    }
  };

  handleLike = () => {
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
    const { dataSource, creatorId, appLocale } = this.props;
    return (
      <View key={dataSource._id} style={styles.container}>
        <View style={styles.replyUserAvatar}>
          <Thumbnail
            source={dataSource.from.avatar}
            style={{ width: 40, height: 40 }}
          />
        </View>
        <View style={styles.replyContentWrapper}>
          <View style={styles.replyUsername}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.handleReply();
            }}
            style={styles.replyContents}
          >
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
                      {`${locale[appLocale]["SHOW_MORE"]} `}
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
                      {`${locale[appLocale]["SHOW_LESS"]} `}
                      <Ionicons name="md-arrow-dropup" />
                    </Text>
                  </TouchableOpacity>
                );
              }}
            >
              <Text style={{ fontWeight: "normal" }}>{dataSource.content}</Text>
            </ViewMoreText>
          </TouchableOpacity>
          <View style={styles.replyMeta}>
            <Text style={{ fontSize: 12, color: "grey" }}>
              {dateConverter(dataSource.createdAt)}
            </Text>
            <View
              style={{
                width: "30%",
                height: "100%",
                position: "absolute",
                right: 0,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.replyMetaIonicons}
              >
                <Ionicons
                  name="ios-thumbs-up"
                  style={{
                    color: dataSource.liked ? theme.primaryColor : "grey"
                  }}
                  onPress={() => {
                    this.handleLike();
                  }}
                />
                <Text style={{ color: "grey", fontSize: 12 }}>
                  {dataSource.likeCount}
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
  client: state.client.client,
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(withNavigation(ReplyListCell));

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  replyUserAvatar: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center"
  },
  replyContentWrapper: {
    width: "85%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  replyContents: {
    width: "98%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  replyMeta: {
    width: "98%",
    height: 20,
    marginTop: 2,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  replyUsername: {
    width: "98%",
    height: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  replyMetaIonicons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
});
