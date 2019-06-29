import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import Button from "./Button";
import Thumbnail from "./Thumbnail";
import { Ionicons } from "@expo/vector-icons";
import ActionSheet from "react-native-actionsheet";

import window from "../utils/getDeviceInfo";
import theme from "../common/theme";
import { locale } from "../common/locale";

class RecommendUserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: this.props.dataSource
    };
  }
  renderPosts = () => {
    const { dataSource } = this.state;
    const { appLocale } = this.props;
    if (dataSource.posts.length === 0) {
      return (
        <Text style={{ fontWeight: "bold", color: "grey" }}>{`- ${
          locale[appLocale]["NO_MORE_POSTS"]
        } -`}</Text>
      );
    }
    return dataSource.posts.map(post => {
      return (
        <Image
          key={post._id}
          style={{
            width: window.width * 0.15,
            height: window.width * 0.15,
            borderRadius: 5
          }}
          source={{ uri: post.image }}
        />
      );
    });
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  followAction = type => {
    const { client, navigation } = this.props;
    const { dataSource } = this.state;
    if (client && client.token) {
      this.setState(
        {
          loading: true
        },
        () => {
          return fetch(`${baseUrl.api}/user/follow`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: client.token
            },
            body: JSON.stringify({
              followingId: dataSource._id,
              type: type
            })
          })
            .then(res => res.json())
            .then(resJson => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  if (resJson.status === 200) {
                    dataSource.followed = !dataSource.followed;
                    this.setState({
                      dataSource: dataSource
                    });
                  }
                }
              );
            })
            .catch(err => {
              this.setState({
                loading: false
              });
              console.log(err);
            });
        }
      );
    } else {
      navigation.push("Auth");
    }
  };

  renderButton = () => {
    const { dataSource } = this.state;
    const { appLocale } = this.props;
    return (
      <Button
        containerStyle={{
          width: 90,
          height: 40,
          backgroundColor: dataSource.followed
            ? "lightgrey"
            : theme.primaryColor,
          borderColor: dataSource.followed ? "black" : null
        }}
        loading={this.state.loading}
        titleStyle={{ fontSize: 14, color: "#fff" }}
        iconRight={() => {
          if (dataSource.followed) {
            return <Ionicons name="md-checkmark" color="#fff" size={18} />;
          }
          return null;
        }}
        title={
          dataSource.followed
            ? `${locale[appLocale]["FOLLOWING"]}`
            : `${locale[appLocale]["FOLLOW"]}`
        }
        onPress={() => {
          dataSource.followed
            ? this.showActionSheet()
            : this.followAction("Follow");
        }}
      />
    );
  };

  render() {
    const { dataSource } = this.state;
    const { itemWidth, itemHeight, appLocale } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            width: itemWidth,
            height: itemHeight
          }
        ]}
      >
        <View style={styles.userDescription}>
          <View
            style={{
              width: "30%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Thumbnail
              style={{ height: 50, width: 50 }}
              source={dataSource.avatar}
            />
          </View>
          <View
            style={{
              width: "70%",
              height: "100%",
              justifyContent: "space-around",
              alignItems: "flex-start"
            }}
          >
            <Text ellipsizeMode="tail">
              {dataSource.username ? dataSource.username : dataSource.nickname}
            </Text>
            <Text ellipsizeMode="tail" numberOfLines={3}>
              {dataSource.bio}
            </Text>
          </View>
        </View>
        <View style={styles.userPost}>{this.renderPosts()}</View>
        <View style={styles.userFollowButton} pointerEvents="auto">
          <Text>{`${locale[appLocale]["FOLLOWER"]}: ${
            dataSource.followerCount
          }`}</Text>
          {this.renderButton()}
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={locale[appLocale]["UNFOLLOW_TITLE"]}
          message={`${locale[appLocale]["UNFOLLOW_INFO"]}`}
          options={[
            `${locale[appLocale]["CONFIRM"]}`,
            `${locale[appLocale]["CANCEL"]}`
          ]}
          cancelButtonIndex={1}
          onPress={index => {
            if (index === 0) {
              //unfollow user
              this.followAction("Unfollow");
            }
          }}
        />
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
)(withNavigation(RecommendUserCard));

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.primaryGrey,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 20
  },
  userDescription: {
    width: "100%",
    height: "20%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  userPost: {
    width: "90%",
    height: "50%",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  userFollowButton: {
    width: "100%",
    height: "30%",
    justifyContent: "space-around",
    alignItems: "center"
  }
});
