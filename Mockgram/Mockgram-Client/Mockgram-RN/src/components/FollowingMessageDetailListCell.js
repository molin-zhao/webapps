import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";

import Thumbnail from "../components/Thumbnail";

import window from "../utils/getDeviceInfo";
import { locale } from "../common/locale";
import { dateConverter } from "../utils/unitConverter";

class FollowingMessasgeDetailListCell extends React.Component {
  renderDate = createdAt => {
    return (
      <Text style={{ color: "grey", fontSize: 12 }}>
        {dateConverter(createdAt)}
      </Text>
    );
  };

  renderContent = () => {
    const { dataSource, appLocale } = this.props;
    const {
      messageType,
      sender,
      receiver,
      postReference,
      commentReference,
      replyReference,
      createdAt
    } = dataSource;
    switch (messageType) {
      case "LikePost":
        return (
          <View style={styles.content}>
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontWeight: "bold" }}
              >
                {sender.username}
              </Text>
              <Ionicons name="ios-heart-empty" size={18} />
              {this.renderDate(createdAt)}
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: postReference.image }}
              />
            </View>
          </View>
        );
      case "LikeComment":
        return (
          <View style={styles.content}>
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontWeight: "bold" }}
                >
                  {sender.username}
                </Text>
                <Ionicons
                  name="ios-heart-empty"
                  size={18}
                  style={{ marginLeft: 10 }}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ marginLeft: 10 }}
                >{`${locale[appLocale]["USERS_COMMENT"](
                  receiver.username
                )}`}</Text>
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {commentReference.content}
              </Text>
              {this.renderDate(createdAt)}
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: postReference.image }}
              />
            </View>
          </View>
        );
      case "LikeReply":
        return (
          <View style={styles.content}>
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontWeight: "bold" }}
                >
                  {sender.username}
                </Text>
                <Ionicons
                  name="ios-heart-empty"
                  size={18}
                  style={{ marginLeft: 10 }}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ marginLeft: 10 }}
                >{`${locale[appLocale]["USERS_REPLY"](
                  receiver.username
                )}`}</Text>
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {commentReference.content}
              </Text>
              {this.renderDate(createdAt)}
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: postReference.image }}
              />
            </View>
          </View>
        );
      case "CommentPost":
        return (
          <View style={styles.content}>
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontWeight: "bold" }}
              >
                {sender.username}
              </Text>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {commentReference.content}
              </Text>
              {this.renderDate(createdAt)}
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: postReference.image }}
              />
            </View>
          </View>
        );
      case "ReplyReply":
      case "ReplyComment":
        return (
          <View style={styles.content}>
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontWeight: "bold" }}
                >
                  {sender.username}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ marginLeft: 10 }}
                >{`${locale[appLocale]["USER_REPLY_TO"](
                  receiver.username
                )}`}</Text>
              </View>
              <Text numberOfLines={2} ellipsizeMode="tail">
                {replyReference.content}
              </Text>
              {this.renderDate(createdAt)}
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: postReference.image }}
              />
            </View>
          </View>
        );
      case "Follow":
        return (
          <View style={styles.content}>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{sender.username}</Text>
              <Text>{`${locale[appLocale]["FOLLOW_ACTION"](
                locale[appLocale]["YOU"]
              )}`}</Text>
              {this.renderDate(createdAt)}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  render() {
    const { dataSource } = this.props;
    const { sender } = dataSource;
    return (
      <View key={dataSource._id} style={styles.cell}>
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Thumbnail source={sender.avatar} style={{ width: 50, height: 50 }} />
        </View>
        {this.renderContent()}
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
)(withNavigation(FollowingMessasgeDetailListCell));

const styles = StyleSheet.create({
  cell: {
    width: "100%",
    height: window.height * 0.1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  content: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "80%",
    height: "100%"
  }
});
