import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";

import Button from "../../components/Button";
import Thumbnail from "../../components/Thumbnail";
import TabView from "../../components/TabView";
import PostsGridView from "./PostsGridView";

import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      initialProfile: {
        _id: this.props.navigation.getParam("_id", null),
        username: this.props.navigation.getParam("username", ""),
        avatar: this.props.navigation.getParam("avatar", ""),
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        bio: "no bio yet"
      },
      refreshing: false,
      loading: false,
      error: null,
      followActionProcessing: false,
      interrupt: false,
      fetching: true
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    let username = navigation.getParam("username", "");
    if (username) {
      await navigation.setParams({
        title: username
      });
      this.fetchUserProfile();
    }
  }

  componentDidUpdate(prevProps) {
    const { client } = this.props;
    if (prevProps.client != client) {
      if (this.state.fetching) {
        this.setState(
          {
            interrupt: true
          },
          () => {
            this.fetchUserProfile();
          }
        );
      }
    }
  }

  fetchUserProfile = () => {
    const { client } = this.props;
    const { initialProfile } = this.state;
    this.setState(
      {
        fetching: true
      },
      () => {
        return fetch(`${baseUrl.api}/profile`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: initialProfile._id,
            clientId: client && client.user ? client.user._id : null
          })
        })
          .then(res => res.json())
          .then(res => {
            if (this.state.interrupt) {
              this.setState({
                interrupt: false
              });
            } else {
              this.setState({
                profile: res.data,
                error: res.status === 200 ? null : res.msg
              });
            }
          })
          .then(() => {
            this.setState({
              loading: false,
              refreshing: false,
              fetching: false
            });
          })
          .catch(err => {
            this.setState(
              {
                refreshing: false,
                loading: false,
                fetching: false,
                error: err
              },
              () => {
                console.log(err);
              }
            );
          });
      }
    );
  };

  onRefresh = () => {
    if (!this.state.refreshing) {
      this.setState(
        {
          refreshing: true
        },
        () => {
          this.fetchUserProfile();
        }
      );
    }
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  followAction = type => {
    const { client, navigation } = this.props;
    const { profile } = this.state;
    if (client && client.token) {
      this.setState(
        {
          followActionProcessing: true
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
              followingId: profile._id,
              type: type
            })
          })
            .then(res => res.json())
            .then(resJson => {
              this.setState(
                {
                  followActionProcessing: false
                },
                () => {
                  if (resJson.status === 200) {
                    profile.followed = !profile.followed;
                    this.setState({
                      profile: profile
                    });
                  }
                }
              );
            })
            .catch(err => {
              this.setState(
                {
                  followActionProcessing: false
                },
                () => {
                  console.log(err);
                }
              );
            });
        }
      );
    } else {
      navigation.navigate("Auth");
    }
  };

  renderButton = () => {
    const { profile } = this.state;
    if (!profile) {
      return null;
    }
    let followStyle = {
      backgroundColor: theme.primaryColor
    };
    let followingStyle = {
      backgroundColor: "lightgrey",
      borderColor: "black"
    };
    return (
      <View
        style={{
          marginTop: 15,
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          width: "80%"
        }}
      >
        <Button
          containerStyle={[
            { width: "90%", height: 40 },
            profile.followed ? followingStyle : followStyle
          ]}
          loading={this.state.followActionProcessing}
          titleStyle={[{ fontSize: 14, color: "#fff", marginRight: 10 }]}
          iconRight={() => {
            if (profile.followed) {
              return <Ionicons name="md-checkmark" color="#fff" size={18} />;
            }
            return null;
          }}
          title={profile.followed ? "following" : "follow"}
          onPress={() => {
            profile.followed
              ? this.showActionSheet()
              : this.followAction("Follow");
          }}
        />
      </View>
    );
  };

  render() {
    const { initialProfile, profile } = this.state;
    const { navigation } = this.props;
    let userProfile = profile ? profile : initialProfile;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start"
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        horizontal={false}
      >
        <Thumbnail
          style={{ marginTop: 30, height: 80, width: 80 }}
          source={userProfile.avatar}
        />
        <View style={styles.count}>
          <TouchableOpacity style={styles.countSubview} activeOpacity={0.8}>
            <Text style={styles.countText}>{userProfile.postCount}</Text>
            <Text style={styles.countText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countSubview}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("UserList", {
                userId: userProfile._id,
                type: "Following"
              });
            }}
          >
            <Text style={styles.countText}>{userProfile.followingCount}</Text>
            <Text style={styles.countText}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countSubview}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("UserList", {
                userId: userProfile._id,
                type: "Follower"
              });
            }}
          >
            <Text style={styles.countText}>{userProfile.followerCount}</Text>
            <Text style={styles.countText}>Follower</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bio}>
          <Text style={styles.bioText}>{userProfile.bio}</Text>
        </View>
        {this.renderButton()}
        <View style={styles.embeddedTabView}>
          <TabView
            activeColor={theme.primaryColor}
            inactiveColor={"black"}
            tabBarComponents={[
              {
                icon: {
                  name: "md-images"
                },
                text: {
                  title: "Posts"
                }
              },
              {
                icon: {
                  name: "md-heart"
                },
                text: {
                  title: "Liked"
                }
              },
              {
                icon: {
                  name: "ios-people"
                },
                text: {
                  title: "Mentioned"
                }
              }
            ]}
          >
            <PostsGridView
              type="CREATED"
              userId={userProfile._id}
              refreshing={this.state.refreshing}
              dataSource={null}
              numColumns={3}
            />
            <PostsGridView
              type="LIKED"
              userId={userProfile._id}
              refreshing={this.state.refreshing}
              dataSource={null}
              numColumns={3}
            />
            <PostsGridView
              type="MENTIONED"
              userId={userProfile._id}
              refreshing={this.state.refreshing}
              dataSource={null}
              numColumns={3}
            />
          </TabView>
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title="Confirm this action to unfollow user"
          message={`\nDo you want to unfollow user ${
            userProfile.username
          }?\nYou will not receive any updates and messages from this user`}
          options={["confirm", "cancel"]}
          cancelButtonIndex={1}
          onPress={index => {
            if (index === 0) {
              //unfollow user
              this.followAction("Unfollow");
            }
          }}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(UserProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  count: {
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: window.height * 0.1
  },
  countSubview: {
    width: "30%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  countText: {
    alignSelf: "center",
    fontSize: 15
  },
  bio: {
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 50
  },
  bioText: {
    fontSize: 12
  },
  embeddedTabView: {
    marginTop: 15
  }
});
