import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Constants } from "expo";
import { SkypeIndicator } from "react-native-indicators";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import ViewMoreText from "react-native-view-more-text";
import PropTypes from "prop-types";
import { withNavigation, Header } from "react-navigation";

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
import { locale } from "../common/locale";

numColumns = 3;

class UserProfile extends React.Component {
  mounted = false;

  static defaultProps = {
    clientProfile: false,
    avatar: "",
    username: ""
  };

  static propTypes = {
    clientProfile: PropTypes.bool,
    avatar: PropTypes.string,
    username: PropTypes.string
  };

  constructor(props) {
    super(props);
    const {
      clientProfile,
      myProfile,
      id,
      username,
      avatar,
      appLocale
    } = this.props;
    this.state = {
      profile: {
        _id: clientProfile ? myProfile._id : id,
        username: clientProfile ? myProfile.username : username,
        avatar: clientProfile ? myProfile.avatar : avatar,
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        bio: ""
      },
      activeIndex: 0,
      refreshing: false,
      loading: false,
      error: null,
      followActionProcessing: false,
      created: {
        data: [],
        hasMore: true,
        loadingMore: false
      },
      mentioned: {
        data: [],
        hasMore: true,
        loadingMore: false
      },
      liked: {
        data: [],
        hasMore: true,
        loadingMore: false
      },
      tabBarComponents: [
        {
          icon: {
            name: "md-images"
          },
          text: {
            title: "POSTS"
          }
        },
        {
          icon: {
            name: "md-heart"
          },
          text: {
            title: "LIKED"
          }
        },
        {
          icon: {
            name: "ios-people"
          },
          text: {
            title: "MENTIONED"
          }
        }
      ]
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setState(
      {
        loading: true
      },
      async () => {
        await this.fetchUserProfile();
        await this.fetchUserPosts(Types.CREATED_POST);
        await this.fetchUserPosts(Types.LIKED_POST);
        await this.fetchUserPosts(Types.MENTIONED_POST);
        if (this.mounted) {
          this.setState({
            loading: false
          });
        }
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  titleMapper = () => {
    const { clientProfile, appLocale } = this.props;
    if (clientProfile) {
      return `${locale[appLocale]["YOUR"]}`;
    }
    return `${locale[appLocale]["USER_S"]}`;
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

  _loadingMore = type => {
    const { created, mentioned, liked, loading, refreshing } = this.state;
    if (loading || refreshing) return false;
    switch (type) {
      case Types.CREATED_POST:
        return created.loadingMore;
      case Types.LIKED_POST:
        return liked.loadingMore;
      case Types.MENTIONED_POST:
        return mentioned.loadingMore;
      default:
        return false;
    }
  };

  fetchUserPosts = type => {
    const {
      clientProfile,
      id,
      client,
      addClientProfilePosts,
      reloadClientProfilePosts
    } = this.props;
    let loadingMore = this._loadingMore(type);
    let lastData = this._getPostsByType(type);
    let lqDataIds = loadingMore ? parseIdFromObjectArray(lastData) : [];
    let lqDataLastItem = loadingMore ? lastData.slice(-1).pop() : null;
    let body = JSON.stringify({
      limit: config.POST_RETURN_LIMIT,
      userId: clientProfile ? client.user._id : id,
      lastQueryDataIds: lqDataIds,
      type,
      lastQueryDataLastItem: lqDataLastItem
    });
    return fetch(`${baseUrl.api}/profile/post`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body
    })
      .then(res => res.json())
      .then(resJson => {
        if (this.mounted) {
          if (resJson.status === 200) {
            let hasMore =
              resJson.data.length < config.POST_RETURN_LIMIT ? false : true;
            if (clientProfile) {
              if (loadingMore) {
                addClientProfilePosts(type, resJson.data, hasMore);
              } else {
                reloadClientProfilePosts(type, resJson.data, hasMore);
              }
            } else {
              this._updatePostsByType(type, resJson.data);
            }
          } else {
            // error resJson status !== 200
            this.setState({
              error: resJson.msg
            });
          }
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
        if (clientProfile) return myMentioned.data;
        return mentioned.data;
      case Types.LIKED_POST:
        if (clientProfile) return myLiked.data;
        return liked.data;
    }
  };

  _updatePostsByType = (type, data) => {
    const { loading, refreshing, created, liked, mentioned } = this.state;
    let shouldReloadData = loading || refreshing;
    switch (type) {
      case Types.CREATED_POST:
        this.setState({
          created: {
            data:
              created && !shouldReloadData
                ? data.new.concat(this.state.created.data).concat(data.old)
                : data.old,
            hasMore: data.length < config.POST_RETURN_LIMIT ? false : true
          }
        });
        break;
      case Types.MENTIONED_POST:
        this.setState({
          mentioned: {
            data:
              mentioned && !shouldReloadData
                ? data.new.concat(this.state.mentioned.data).concat(data.old)
                : data.old,
            hasMore: data.length < config.POST_RETURN_LIMIT ? false : true
          }
        });
        break;
      case Types.LIKED_POST:
        this.setState({
          liked: {
            data:
              liked && !shouldReloadData
                ? data.new.concat(this.state.liked.data).concat(data.old)
                : data.old,
            hasMore: data.length < config.POST_RETURN_LIMIT ? false : true
          }
        });
        break;
      default:
        break;
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
    const { activeIndex, created, liked, mentioned } = this.state;
    const { clientProfile, myCreated, myLiked, myMentioned } = this.props;
    switch (activeIndex) {
      case 0:
        if (created.loadingMore) return;
        if (
          (clientProfile && myCreated.hasMore) ||
          (!clientProfile && created.hasMore)
        ) {
          this.setState(
            {
              created: {
                ...created,
                loadingMore: true
              }
            },
            async () => {
              await this.fetchUserPosts(Types.CREATED_POST);
              if (this.mounted) {
                this.setState({
                  created: {
                    ...created,
                    loadingMore: false
                  }
                });
              }
            }
          );
          break;
        }
        break;
      case 1:
        if (liked.loadingMore) return;
        if (
          (clientProfile && myLiked.hasMore) ||
          (!clientProfile && liked.hasMore)
        ) {
          this.setState(
            {
              liked: {
                ...liked,
                loadingMore: true
              }
            },
            async () => {
              await this.fetchUserPosts(Types.LIKED_POST);
              if (this.mounted) {
                this.setState({
                  liked: {
                    ...liked,
                    loadingMore: false
                  }
                });
              }
            }
          );
          break;
        }
        break;
      case 2:
        if (mentioned.loadingMore) return;
        if (
          (clientProfile && myMentioned.hasMore) ||
          (!clientProfile && mentioned.hasMore)
        ) {
          this.setState(
            {
              mentioned: {
                ...mentioned,
                loadingMore: true
              }
            },
            async () => {
              await this.fetchUserPosts(Types.MENTIONED_POST);
              if (this.mounted) {
                this.setState({
                  mentioned: {
                    ...mentioned,
                    loadingMore: true
                  }
                });
              }
            }
          );
          break;
        }
        break;
      default:
        break;
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
          if (this.mounted) {
            this.setState({
              refreshing: false
            });
          }
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
      backgroundColor: theme.primaryColor,
      height: 40,
      width: 120
    };
    let followingStyle = {
      backgroundColor: "lightgrey",
      height: 40,
      width: 120
    };
    return (
      <View
        style={{
          marginTop: theme.marginTop,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Button
          containerStyle={profile.followed ? followingStyle : followStyle}
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
    const { appLocale } = this.props;
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
              {`${locale[appLocale][tabComponent.text.title]}`}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    });
  };

  renderContentHeader = () => {
    const { profile, tabBarComponents } = this.state;
    const { clientProfile, myProfile, navigation, appLocale } = this.props;
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
            <Text style={styles.countText}>{`${
              locale[appLocale]["POSTS"]
            }`}</Text>
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
            <Text style={styles.countText}>{`${
              locale[appLocale]["FOLLOWING"]
            }`}</Text>
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
            <Text style={styles.countText}>{`${
              locale[appLocale]["FOLLOWERS"]
            }`}</Text>
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
            <Text style={{ fontWeight: "bold" }}>
              {`${locale[appLocale]["BIO"]}`}
              <Text style={{ fontWeight: "normal" }}>{`  ${
                _profile.bio
              }`}</Text>
            </Text>
          </ViewMoreText>
        </View>
        {this.renderButton()}
        <View style={styles.tab}>{this.renderTabs(tabBarComponents)}</View>
      </View>
    );
  };

  _renderFooterContent = () => {
    const { appLocale } = this.props;
    return (
      <View style={styles.footer}>
        <Text style={{ color: "lightgrey", fontSize: 12 }}>
          {`- ${locale[appLocale]["NO_MORE_POSTS"]} -`}
        </Text>
      </View>
    );
  };

  renderFooter = () => {
    const { created, liked, mentioned, loading, activeIndex } = this.state;
    const { myCreated, myLiked, myMentioned, clientProfile } = this.props;
    if (loading) return null;
    if (clientProfile) {
      switch (activeIndex) {
        case 0:
          if (myCreated.data.length > 0 && !myCreated.hasMore)
            return this._renderFooterContent();
          return null;
        case 1:
          if (myLiked.data.length > 0 && !myLiked.hasMore)
            return this._renderFooterContent();
          return null;
        case 2:
          if (myMentioned.data.length > 0 && !myMentioned.hasMore)
            return this._renderFooterContent();
          return null;
        default:
          return null;
      }
    } else {
      switch (activeIndex) {
        case 0:
          if (created.data.length > 0 && !created.hasMore)
            return this._renderFooterContent();
          return null;
        case 1:
          if (liked.data.length > 0 && !liked.hasMore)
            return this._renderFooterContent();
          return null;
        case 2:
          if (mentioned.data.length > 0 && !mentioned.hasMore)
            return this._renderFooterContent();
          return null;
        default:
          return null;
      }
    }
  };

  renderEmpty = () => {
    const { activeIndex, created, liked, mentioned, loading } = this.state;
    const {
      clientProfile,
      myCreated,
      myLiked,
      myMentioned,
      appLocale
    } = this.props;
    if (loading) return null;
    switch (activeIndex) {
      case 0:
        if (
          (clientProfile && myCreated.data.length === 0) ||
          (!clientProfile && created.data.length === 0)
        ) {
          return (
            <View style={styles.postViewEmptyMsg}>
              <Ionicons name="ios-camera" size={theme.iconLg} />
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{`${locale[
                appLocale
              ]["CREATED_POSTS_TITLE"](this.titleMapper())}`}</Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>{`${
                locale[appLocale]["CREATED_POSTS_INFO"]
              }`}</Text>
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
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{`${locale[
                appLocale
              ]["LIKED_POSTS_TITLE"](this.titleMapper())}`}</Text>
              <Text style={{ fontSize: 14, fontWeight: "300" }}>{`${
                locale[appLocale]["LIKED_POSTS_INFO"]
              }`}</Text>
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
              <Text style={{ fontSize: 20, fontWeight: "600" }}>{`${locale[
                appLocale
              ]["MENTIONED_POSTS_TITLE"](this.titleMapper())}`}</Text>
              <Text
                style={{ fontSize: 14, fontWeight: "300", textAlign: "center" }}
              >{`${locale[appLocale]["MENTIONED_POSTS_INFO"]}`}</Text>
            </View>
          );
        }
        return null;
      default:
        return null;
    }
  };

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
    let _created = clientProfile ? myCreated.data : created.data;
    let _liked = clientProfile ? myLiked.data : liked.data;
    let _mentioned = clientProfile ? myMentioned.data : mentioned.data;
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <FlatList
          extraData={clientProfile ? this.props : this.state}
          data={normalizeData(_mentioned, numColumns)}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          numColumns={numColumns}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            backgroundColor: "transparent",
            width: window.width,
            zIndex: this.activeIndex(2),
            elevation: this.activeIndex(2),
            opacity: this.activeIndex(2)
          }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={this.renderContentHeader}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PostGridViewImage dataSource={item} numColumns={numColumns} />
          )}
          contentContainerStyle={{ backgroundColor: "#fff" }}
        />
        <FlatList
          data={normalizeData(_liked, numColumns)}
          extraData={clientProfile ? this.props : this.state}
          numColumns={numColumns}
          style={{
            width: window.width,
            position: "absolute",
            top: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: this.activeIndex(1),
            elevation: this.activeIndex(1),
            opacity: this.activeIndex(1)
          }}
          ListHeaderComponent={this.renderContentHeader}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PostGridViewImage dataSource={item} numColumns={numColumns} />
          )}
          contentContainerStyle={{ backgroundColor: "#fff" }}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
        />

        <FlatList
          data={normalizeData(_created, numColumns)}
          extraData={clientProfile ? this.props : this.state}
          numColumns={numColumns}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          style={{
            width: window.width,
            position: "absolute",
            top: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: this.activeIndex(0),
            elevation: this.activeIndex(0),
            opacity: this.activeIndex(0)
          }}
          ListHeaderComponent={this.renderContentHeader}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <PostGridViewImage dataSource={item} numColumns={numColumns} />
          )}
          contentContainerStyle={{ backgroundColor: "#fff" }}
        />
      </View>
    );
  };

  render() {
    const { appLocale } = this.props;
    return (
      <View style={styles.container}>
        {this.renderContentView()}
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={`${locale[appLocale]["UNFOLLOW_TITLE"]}`}
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
  appLocale: state.app.appLocale,
  client: state.client.client,
  myProfile: state.profile.profile,
  myCreated: state.profile.created,
  myLiked: state.profile.liked,
  myMentioned: state.profile.mentioned
});

const mapDispatchToProps = dispatch => ({
  fetchClientProfile: token => dispatch(getClientProfile(token)),
  addClientProfilePosts: (type, data, hasMore) =>
    dispatch(addClientProfilePosts(type, data, hasMore)),
  reloadClientProfilePosts: (type, data, hasMore) =>
    dispatch(reloadClientProfilePosts(type, data, hasMore))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(UserProfile));

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height - Header.HEIGHT,
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
    borderTopColor: theme.primaryGrey,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.primaryGrey,
    zIndex: 1,
    elevation: 1
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
    alignItems: "center",
    justifyContent: "center",
    height: 60
  }
});
