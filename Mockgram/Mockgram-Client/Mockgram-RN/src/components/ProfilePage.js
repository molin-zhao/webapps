import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { SkypeIndicator, BallIndicator } from "react-native-indicators";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import ViewMoreText from "react-native-view-more-text";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";

import PostGridViewImage from "./PostGridViewImage";
import Button from "./Button";
import Thumbnail from "./Thumbnail";
import {
  getClientProfile,
  addClientProfilePosts,
  reloadClientProfilePosts
} from "../redux/actions/profileActions";

import baseUrl from "../common/baseUrl";
import window from "../utils/getDeviceInfo";
import theme from "../common/theme";
import config from "../common/config";
import * as Types from "../common/types";
import { normalizeData } from "../utils/arrayEditor";
import { parseIdFromObjectArray } from "../utils/idParser";

numColumns = 3;

class UserProfile extends React.Component {
  mounted = false;

  static defaultProps = {
    clientProfile: false
  };

  static propTypes = {
    clientProfile: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      profile: {
        _id: this.props.clientProfile
          ? this.props.myProfile._id
          : this.props.navigation.getParam("id"),
        username: this.props.clientProfile
          ? this.props.myProfile.username
          : this.props.navigation.getParam("username"),
        avatar: this.props.clientProfile
          ? this.props.myProfile.avatar
          : this.props.navigation.getParam("avatar"),
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        bio: ""
      },
      activeIndex: 0,
      created: {
        data: [],
        hasMore: true
      },
      mentioned: {
        data: [],
        hasMore: true
      },
      liked: {
        data: [],
        hasMore: true
      },
      refreshing: false,
      loading: false,
      loadingMore: false,
      error: null,
      followActionProcessing: false,
      tabBarComponents: [
        {
          icon: {
            name: "md-images"
          },
          text: {
            title: `${this.props.i18n.t("POSTS")}`
          }
        },
        {
          icon: {
            name: "md-heart"
          },
          text: {
            title: `${this.props.i18n.t("LIKED")}`
          }
        },
        {
          icon: {
            name: "ios-people"
          },
          text: {
            title: `${this.props.i18n.t("MENTIONED")}`
          }
        }
      ]
    };
  }

  componentDidMount() {
    this.mounted = true;
    const { navigation, username, clientProfile } = this.props;
    let title = navigation.getParam("username");
    navigation.setParams({
      profileTitle: title ? title : username,
      clientProfile
    });
    this.setState(
      {
        loading: true
      },
      async () => {
        await this.fetchUserProfile();
        await this.fetchUserPosts(Types.CREATED_POST);
        await this.fetchUserPosts(Types.LIKED_POST);
        await this.fetchUserPosts(Types.MENTIONED_POST);
        this.setState({
          loading: false
        });
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  titleMapper = () => {
    const { clientProfile, i18n } = this.props;
    if (clientProfile) {
      return `${i18n.t("YOUR")}`;
    }
    return `${i18n.t("USER_S")}`;
  };

  fetchUserProfile = () => {
    const { client, id, clientProfile, fetchClientProfile } = this.props;
    if (clientProfile && client) {
      return fetchClientProfile(client.token);
    }
    return fetch(`${baseUrl.api}/profile`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: id,
        clientId: client ? client.user._id : null
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (this.mounted) {
          if (resJson.status === 200) {
            this.setState({
              profile: resJson.data
            });
          } else {
            this.setState({
              error: resJson.msg
            });
          }
        }
      })
      .then(() => {
        if (this.mounted) {
          this.setState({
            loading: false,
            refreshing: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.mounted) {
          this.setState({
            refreshing: false,
            loading: false,
            error: err
          });
        }
      });
  };

  fetchUserPosts = type => {
    const { loadingMore } = this.state;
    const {
      clientProfile,
      id,
      client,
      addClientProfilePosts,
      reloadClientProfilePosts
    } = this.props;
    let lastData = this._getPostsByType(type);
    let lqDataIds = loadingMore ? parseIdFromObjectArray(lastData) : [];
    let lqDataLastItem = lastData.slice(-1).pop();
    return fetch(`${baseUrl.api}/profile/post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit: config.POST_RETURN_LIMIT,
        userId: clientProfile ? client.user._id : id,
        lastQueryDataIds: lqDataIds,
        type,
        lastQueryDataLastItem: lqDataLastItem
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (this.mounted) {
          if (resJson.status === 200) {
            if (clientProfile) {
              if (loadingMore) {
                addClientProfilePosts(
                  type,
                  resJson.data,
                  (hasMore =
                    resJson.data.length < config.POST_RETURN_LIMIT
                      ? false
                      : true)
                );
              } else {
                reloadClientProfilePosts(type, resJson.data);
              }
            } else {
              this._updatePostsByType(type, resJson.data, loadingMore);
            }
          } else {
            // error
            this.setState({
              error: resJson.msg
            });
          }
        }
      })
      .then(() => {
        if (this.mounted) {
          this.setState({
            loading: false,
            loadingMore: false,
            refreshing: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.mounted) {
          this.setState({
            error: err
          });
        }
      });
  };

  _getPostsByType = type => {
    const { created, liked, mentioned } = this.state;
    const { clientProfile, myCreated, myLiked, myMentioned } = this.props;
    switch (type) {
      case Types.CREATED_POST:
        if (clientProfile) return myCreated.data;
        return created.data;
      case Types.MENTIONED_POST:
        if (clientProfile) return myLiked.data;
        return liked.data;
      case Types.LIKED_POST:
        if (clientProfile) return myMentioned.data;
        return mentioned.data;
    }
  };

  _updatePostsByType = (type, data, loadingMore) => {
    switch (type) {
      case Types.CREATED_POST:
        return this.setState({
          created: {
            data: loadingMore
              ? data.new.concat(this.state.created.data).concat(data.old)
              : data.old,
            hasMore: data.length < config.POST_RETURN_LIMIT ? false : true
          }
        });
      case Types.MENTIONED_POST:
        return this.setState({
          created: {
            data: loadingMore
              ? data.new.concat(this.state.mentioned.data).concat(data.old)
              : data.old,
            hasMore: data.length < config.POST_RETURN_LIMIT ? false : true
          }
        });
      case Types.LIKED_POST:
        return this.setState({
          created: {
            data: loadingMore
              ? data.new.concat(this.state.liked.data).concat(data.old)
              : data.old,
            hasMore: data.length < config.POST_RETURN_LIMIT ? false : true
          }
        });
      default:
        return;
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
              console.log(err);
              this.setState({
                followActionProcessing: false
              });
            });
        }
      );
    } else {
      navigation.navigate("Auth");
    }
  };

  onEndReached = () => {
    const { activeIndex, created, liked, mentioned, loadingMore } = this.state;
    const { clientProfile, myCreated, myLiked, myMentioned } = this.props;
    if (loadingMore) {
      return;
    }

    if (activeIndex === 0) {
      if (
        (clientProfile && myCreated.hasMore) ||
        (!clientProfile && created.hasMore)
      )
        return this.setState(
          {
            loadingMore: true
          },
          () => {
            this.fetchUserPosts(Types.CREATED_POST);
          }
        );
    } else if (activeIndex === 1) {
      if (
        (clientProfile && myLiked.hasMore) ||
        (!clientProfile && liked.hasMore)
      )
        return this.setState(
          {
            loadingMore: true
          },
          () => {
            this.fetchUserPosts(Types.LIKED_POST);
          }
        );
    } else {
      if (
        (clientProfile && myMentioned.hasMore) ||
        (!clientProfile && mentioned.hasMore)
      )
        return this.setState(
          {
            loadingMore: true
          },
          () => {
            this.fetchUserPosts(Types.MENTIONED_POST);
          }
        );
    }
  };

  onRefresh = () => {
    if (!this.state.refreshing) {
      this.setState(
        {
          refreshing: true
        },
        async () => {
          await this.fetchUserProfile();
          await this.fetchUserPosts(Types.CREATED_POST);
          await this.fetchUserPosts(Types.LIKED_POST);
          await this.fetchUserPosts(Types.MENTIONED_POST);
          this.setState({
            refreshing: false
          });
        }
      );
    }
  };

  renderButton = () => {
    const { profile } = this.state;
    const { clientProfile } = this.props;
    if (clientProfile || !profile) {
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
          containerStyle={
            ({ width: "90%", height: 40 },
            profile.followed ? followingStyle : followStyle)
          }
          loading={this.state.followActionProcessing}
          disabled={this.state.followActionProcessing}
          titleStyle={{ fontSize: 14, color: "#fff", marginRight: 10 }}
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

  tabSelected = index => {
    this.setState({
      activeIndex: index
    });
  };

  activeStyle = index => {
    return this.state.activeIndex === index ? theme.primaryColor : "black";
  };

  activeIndex = index => {
    return this.state.activeIndex === index ? 1 : 0;
  };

  renderTabs = tabBarComponents => {
    return tabBarComponents.map((tabComponent, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={styles.tabCell}
          onPress={() => this.tabSelected(index)}
        >
          {tabComponent.icon ? (
            <Ionicons
              name={tabComponent.icon.name}
              style={[
                { fontSize: 24, color: this.activeStyle(index) },
                tabComponent.icon.style
              ]}
              name={tabComponent.icon.name}
              size={theme.btnMd}
            />
          ) : null}
          {tabComponent.text ? (
            <Text
              style={[
                { fontSize: 10, color: this.activeStyle(index) },
                tabComponent.text.style
              ]}
            >
              {tabComponent.text.title}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    });
  };

  renderContentHeader = () => {
    const { profile } = this.state;
    const { i18n, clientProfile, myProfile, navigation } = this.props;
    let _profile = clientProfile ? myProfile : profile;
    return (
      <View
        style={{
          width: window.width,
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <Thumbnail
          style={{ marginTop: theme.marginTop, height: 60, width: 60 }}
          source={_profile.avatar}
        />
        <View style={styles.count}>
          <TouchableOpacity style={styles.countSubview} activeOpacity={0.8}>
            <Text style={styles.countText}>{_profile.postCount}</Text>
            <Text style={styles.countText}>{`${i18n.t("POSTS")}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countSubview}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("UserList", {
                userId: _profile._id,
                type: "Following"
              });
            }}
          >
            <Text style={styles.countText}>{_profile.followingCount}</Text>
            <Text style={styles.countText}>{`${i18n.t("FOLLOWING")}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.countSubview}
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("UserList", {
                userId: _profile._id,
                type: "Follower"
              });
            }}
          >
            <Text style={styles.countText}>{_profile.followerCount}</Text>
            <Text style={styles.countText}>{`${i18n.t("FOLLOWERS")}`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bio}>
          <ViewMoreText
            numberOfLines={3}
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
                  <Text style={{ color: theme.primaryBlue }} onPress={onPress}>
                    {`${i18n.t("SHOW_MORE")} `}
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
                    {`${i18n.t("SHOW_LESS")} `}
                    <Ionicons name="md-arrow-dropup" />
                  </Text>
                </TouchableOpacity>
              );
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {`${i18n.t("BIO")}`}
              <Text style={{ fontWeight: "normal" }}>{`  ${
                _profile.bio
              }`}</Text>
            </Text>
          </ViewMoreText>
        </View>
        {this.renderButton()}
        <View style={styles.tab}>
          {this.renderTabs(this.state.tabBarComponents)}
        </View>
      </View>
    );
  };

  renderEmpty = () => {
    const { activeIndex, created, liked, mentioned } = this.state;
    const { i18n, clientProfile, myCreated, myLiked, myMentioned } = this.props;
    switch (activeIndex) {
      case 0:
        if (
          (clientProfile && myCreated.data.length === 0) ||
          (!clientProfile && created.data.length === 0)
        ) {
          return (
            <View style={styles.postViewEmptyMsg}>
              <Ionicons name="ios-camera" size={theme.iconLg} />
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{`${i18n.t(
                "CREATED_POSTS_TITLE",
                { value: `${this.titleMapper()}` }
              )}`}</Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>{`${i18n.t(
                "CREATED_POSTS_INFO"
              )}`}</Text>
            </View>
          );
        }
        return null;
      case 1:
        if (
          (clientProfile && myLiked.data.length === 0) ||
          (!clientProfile && liked.data.length === 0)
        ) {
          return (
            <View style={styles.postViewEmptyMsg}>
              <Ionicons name="ios-heart-empty" size={theme.iconLg} />
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{`${i18n.t(
                "LIKED_POSTS_TITLE",
                { value: `${this.titleMapper()}` }
              )}`}</Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>{`${i18n.t(
                "LIKED_POSTS_INFO"
              )}`}</Text>
            </View>
          );
        }
        return null;
      case 2:
        if (
          (clientProfile && myMentioned.data.length === 0) ||
          (!clientProfile && mentioned.data.length === 0)
        ) {
          return (
            <View style={styles.postViewEmptyMsg}>
              <Ionicons name="ios-at" size={theme.iconLg} />
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{`${i18n.t(
                "MENTIONED_POSTS_TITLE",
                { value: `${this.titleMapper()}` }
              )}`}</Text>
              <Text
                style={{ fontSize: 14, fontWeight: "300", textAlign: "center" }}
              >{`${i18n.t("MENTIONED_POSTS_INFO")}`}</Text>
            </View>
          );
        }
        return null;
      default:
        return null;
    }
  };

  // TODO
  // renderFooter = () => {
  //   const {
  //     loading,
  //     refreshing,
  //     loadingMore,
  //     activeIndex,
  //     mentioned,
  //     liked,
  //     created
  //   } = this.state;
  //   const { clientProfile, i18n, myCreated, myLiked, myMentioned } = this.props;
  //   switch (activeIndex) {
  //     case 0:
  //       if (!loading && !refreshing && !loadingMore) {
  //         if (
  //           (clientProfile && myCreated.data.length > 0) ||
  //           (!clientProfile && created.data.length > 0)
  //         ) {
  //           console.log("no more created");
  //           return (
  //             <View style={styles.footer}>
  //               <Text style={{ color: "grey", fontSize: 12 }}>{`${i18n.t(
  //                 "NO_MORE_POSTS"
  //               )}`}</Text>
  //             </View>
  //           );
  //         }
  //         return null;
  //       } else if (loadingMore) {
  //         return (
  //           <View style={styles.footer}>
  //             <BallIndicator size={theme.iconSm} />
  //           </View>
  //         );
  //       } else {
  //         return null;
  //       }
  //     case 1:
  //       if (!loading && !refreshing && !loadingMore) {
  //         if (
  //           (clientProfile && myLiked.data.length > 0) ||
  //           (!clientProfile && liked.data.length > 0)
  //         ) {
  //           console.log("no more liked");
  //           return (
  //             <View style={styles.footer}>
  //               <Text style={{ color: "grey", fontSize: 12 }}>{`${i18n.t(
  //                 "NO_MORE_POSTS"
  //               )}`}</Text>
  //             </View>
  //           );
  //         }
  //         return null;
  //       } else if (loadingMore) {
  //         return (
  //           <View style={styles.footer}>
  //             <BallIndicator size={theme.iconSm} />
  //           </View>
  //         );
  //       } else {
  //         return null;
  //       }
  //     case 2:
  //       if (!loading && !refreshing && !loadingMore) {
  //         if (
  //           (clientProfile && myMentioned.data.length > 0) ||
  //           (!clientProfile && mentioned.data.length > 0)
  //         ) {
  //           console.log("no more mentioned");
  //           return (
  //             <View style={styles.footer}>
  //               <Text style={{ color: "grey", fontSize: 12 }}>{`${i18n.t(
  //                 "NO_MORE_POSTS"
  //               )}`}</Text>
  //             </View>
  //           );
  //         }
  //         return null;
  //       } else if (loadingMore) {
  //         return (
  //           <View style={styles.footer}>
  //             <BallIndicator size={theme.iconSm} />
  //           </View>
  //         );
  //       } else {
  //         return null;
  //       }
  //     default:
  //       return null;
  //   }
  // };

  renderContentView = () => {
    const { mentioned, liked, created, loading } = this.state;
    const {
      clientProfile,
      myProfile,
      myCreated,
      myLiked,
      myMentioned
    } = this.props;
    if ((clientProfile && !myProfile) || loading) {
      return <SkypeIndicator size={theme.indicatorLg} />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <FlatList
          extraData={this.state}
          data={normalizeData(
            clientProfile ? myCreated.data : created.data,
            numColumns
          )}
          numColumns={numColumns}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          style={{
            position: "absolute",
            top: 0,
            backgroundColor: "#fff",
            width: "100%",
            flex: 1,
            zIndex: this.activeIndex(1)
          }}
          ListHeaderComponent={this.renderContentHeader}
          // ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PostGridViewImage dataSource={item} numColumns={numColumns} />
          )}
        />
        <FlatList
          extraData={this.state}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          data={normalizeData(
            clientProfile ? myLiked.data : liked.data,
            numColumns
          )}
          numColumns={numColumns}
          style={{
            position: "absolute",
            top: 0,
            backgroundColor: "#fff",
            width: "100%",
            flex: 1,
            zIndex: this.activeIndex(1)
          }}
          ListHeaderComponent={this.renderContentHeader}
          // ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PostGridViewImage dataSource={item} numColumns={numColumns} />
          )}
        />
        <FlatList
          extraData={this.state}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          data={normalizeData(
            clientProfile ? myMentioned.data : mentioned.data,
            numColumns
          )}
          numColumns={numColumns}
          style={{
            position: "absolute",
            top: 0,
            backgroundColor: "#fff",
            width: "100%",
            flex: 1,
            zIndex: this.activeIndex(2)
          }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={this.renderContentHeader}
          // ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PostGridViewImage dataSource={item} numColumns={numColumns} />
          )}
        />
      </View>
    );
  };

  render() {
    const { i18n } = this.props;
    return (
      <View style={styles.container}>
        {this.renderContentView()}
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={`${i18n.t("UNFOLLOW_TITLE")}`}
          message={`${i18n.t("UNFOLLOW_INFO")}`}
          options={[`${i18n.t("CONFIRM")}`, `${i18n.t("CANCEL")}`]}
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
  i18n: state.app.i18n,
  myProfile: state.profile.profile,
  myCreated: state.profile.created,
  myLiked: state.profile.liked,
  myMentioned: state.profile.mentioned
});

const mapDispatchToProps = dispatch => ({
  fetchClientProfile: token => dispatch(getClientProfile(token)),
  addClientProfilePosts: (type, data, hasMore) =>
    dispatch(addClientProfilePosts(type, data, hasMore)),
  reloadClientProfilePosts: (type, data) =>
    dispatch(reloadClientProfilePosts(type, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(UserProfile));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  count: {
    marginTop: theme.marginTop,
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
    width: "70%",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  bioText: {
    fontSize: 12
  },
  tab: {
    marginTop: theme.marginTop,
    height: window.height * 0.08,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eae5e5",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eae5e5"
  },
  tabCell: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1
  },
  errorMsgView: {
    height: window.width * 0.4,
    width: window.width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  postViewEmptyMsg: {
    height: window.height * 0.4,
    width: window.width,
    justifyContent: "center",
    alignItems: "center"
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60
  }
});
