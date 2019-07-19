import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Text,
  FlatList
} from "react-native";

import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Header } from "react-navigation";
import { SkypeIndicator } from "react-native-indicators";
import { Constants } from "expo";
import { connect } from "react-redux";

import SearchBarView from "../../components/SearchBarView";
import Thumbnail from "../../components/Thumbnail";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import theme from "../../common/theme";
import { parseIdFromObjectArray } from "../../utils/idParser";
import { locale } from "../../common/locale";

class Mention extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      mentionedUsers: this.props.navigation.getParam("mentionedUsers", {}),
      searchedUsers: [],
      followings: [],
      returnValue: null,
      error: null,

      // indicators
      isSearching: false,
      timer: null,
      searchValue: "",
      loading: false,
      loadingMore: false,
      hasMore: true
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      title: navigation.getParam("mentionTitle"),
      headerTitleStyle: {
        fontSize: 14
      },
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: theme.headerIconMargin }}
          onPress={() => {
            navigation.popToTop();
          }}
        >
          <Ionicons name="ios-arrow-back" size={theme.iconMd} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{
            marginRight: 10,
            height: Header.HEIGHT * 0.5,
            width: Header.HEIGHT * 0.8,
            borderRadius: Header.HEIGHT * 0.1,
            backgroundColor: theme.primaryGreen,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => {
            let passMentionedUsersBack = navigation.getParam(
              "passMentionedUsersBack"
            );
            let getMentionedUsers = navigation.getParam("getMentionedUsers");
            passMentionedUsersBack(getMentionedUsers());
            navigation.popToTop();
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {navigation.getParam("mentionDone")}
          </Text>
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this.mounted = true;
    const { navigation, appLocale } = this.props;
    navigation.setParams({
      getMentionedUsers: () => this.state.mentionedUsers,
      mentionTitle: `${locale[appLocale]["ADD_TITLE"](
        locale[appLocale]["USER"]
      )}`,
      mentionDone: `${locale[appLocale]["DONE"]}`
    });
    this.setState(
      {
        loading: true
      },
      () => {
        this.fetchUsers();
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchUsers = () => {
    fetch(`${baseUrl.api}/profile/user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit: config.USER_RETURN_LIMIT,
        lastQueryDataIds: this.state.loadingMore
          ? parseIdFromObjectArray(this.state.followings)
          : [],
        type: "Following",
        userId: "5bc9fa9387f14a5d7d10531a"
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          if (this.mounted) {
            this.setState({
              followings: this.state.followings.concat(resJson.data),
              hasMore:
                resJson.data.length < config.USER_RETURN_LIMIT ? false : true
            });
          }
        } else {
          if (this.mounted) {
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
            loadingMore: false
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          this.setState({
            error: err
          });
        }
      });
  };

  startSearch = () => {
    const { searchValue, searchedUsers, returnValue } = this.state;
    // if last query returned value equals this query search value
    // two queries' values are same -> loading more
    let isLoadingMore = returnValue === searchValue;
    return fetch(`${baseUrl.api}/post/search/following`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        value: searchValue,
        limit: config.SEARCH_RETURN_LIMIT,
        lastQueryDataIds: isLoadingMore
          ? parseIdFromObjectArray(searchedUsers)
          : []
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          console.log(resJson);
          if (this.mounted) {
            this.setState({
              searchedUsers:
                this.state.returnValue === this.state.searchValue
                  ? searchedUsers.concat(resJson.data)
                  : resJson.data,
              returnValue: resJson.value,
              hasMore:
                resJson.data.length < config.SEARCH_RETURN_LIMIT ? false : true
            });
          }
        } else {
          if (this.mounted) {
            this.setState({
              error: resJson.msg,
              returnValue: "",
              hasMore: false
            });
          }
        }
      })
      .catch(err => {
        if (this.mounted) {
          this.setState({
            error: err
          });
        }
      });
  };

  addToMentionedUsers = item => {
    const { mentionedUsers } = this.state;
    if (
      Object.keys(mentionedUsers).length < config.MENTIONED_USER_SELECT_LIMIT
    ) {
      mentionedUsers[item._id] = item;
      this.setState({
        mentionedUsers
      });
    }
  };

  removeFromMentionedUsers = item => {
    const { mentionedUsers } = this.state;
    if (Object.keys(mentionedUsers).includes(item._id)) {
      delete mentionedUsers[item._id];
      this.setState({
        mentionedUsers
      });
    }
  };

  _renderBtn = item => {
    const { mentionedUsers } = this.state;
    if (mentionedUsers[item._id]) {
      // included
      return (
        <Ionicons
          name="ios-radio-button-on"
          size={theme.iconMd}
          color={theme.primaryGreen}
          onPress={() => {
            this.removeFromMentionedUsers(item);
          }}
        />
      );
    }
    return (
      <Ionicons
        name="ios-radio-button-off"
        size={theme.iconMd}
        color={
          Object.keys(mentionedUsers).length <
          config.MENTIONED_USER_SELECT_LIMIT
            ? "black"
            : "lightgrey"
        }
        onPress={() => {
          this.addToMentionedUsers(item);
        }}
      />
    );
  };

  _renderUserList = (item, index) => {
    return (
      <View
        key={index}
        style={{
          width: window.width,
          height: window.height * 0.08,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row"
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "20%",
            height: "100%"
          }}
        >
          <Thumbnail
            source={item.avatar}
            style={{
              width: window.height * 0.04,
              height: window.height * 0.04,
              borderRadius: 5
            }}
          />
        </View>
        <View
          style={{
            width: "60%",
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Text>{`${item.username}`}</Text>
        </View>
        <View
          style={{
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this._renderBtn(item)}
        </View>
      </View>
    );
  };

  renderMentionedUsers = () => {
    const { mentionedUsers } = this.state;
    if (Object.keys(mentionedUsers).length > 0) {
      return (
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: window.width,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start"
          }}
        >
          {Object.values(mentionedUsers).map(item => {
            return (
              <TouchableOpacity
                key={item._id}
                style={{
                  width: window.width / 8,
                  height: window.width / 8,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.removeFromMentionedUsers(item);
                }}
              >
                <Thumbnail
                  style={{ width: "80%", height: "80%", borderRadius: 5 }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    height: theme.iconSm,
                    width: theme.iconSm,
                    borderRadius: theme.iconSm / 2,
                    backgroundColor: "#fff",
                    zIndex: 1
                  }}
                >
                  <Ionicons name="md-close" size={theme.iconSm} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return null;
  };

  renderContentHeader = () => {
    return (
      <View
        style={{
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "#fff"
        }}
      >
        {this.renderMentionedUsers()}
        <View style={{ width: "100%", height: Header.HEIGHT }}>
          <SearchBarView
            containerStyle={{ width: window.width, height: "80%" }}
            searchBarDefaultWidth={window.width * 0.9}
            searchBarFocusedWidth={window.width * 0.85}
            duration={100}
            onChangeText={text => {
              clearTimeout(this.state.timer);
              if (text.length > 0) {
                this.setState({
                  isSearching: true,
                  timer: setTimeout(() => {
                    this.setState(
                      {
                        searchValue: text,
                        timer: null
                      },
                      () => {
                        clearTimeout(this.state.timer);
                        this.startSearch()
                          .then(() => {
                            this.setState({
                              isSearching: false
                            });
                          })
                          .catch(err => {
                            this.setState({
                              isSearching: false,
                              error: err
                            });
                          });
                      }
                    );
                  }, 1000)
                });
              } else {
                this.setState({
                  isSearching: false,
                  timer: null,
                  searchValue: ""
                });
              }
            }}
            rightFontAwesome={() => {
              return (
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>{`${
                  Object.keys(this.state.mentionedUsers).length
                }/${config.MENTIONED_USER_SELECT_LIMIT}`}</Text>
              );
            }}
          />
        </View>
      </View>
    );
  };

  renderContentView = () => {
    const { loading, searchValue, searchedUsers, followings } = this.state;
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <SkypeIndicator size={theme.indicatorLg} />
        </View>
      );
    } else {
      if (searchValue && searchedUsers) {
        return (
          <FlatList
            ListHeaderComponent={this.renderContentHeader}
            style={{
              backgroundColor: "#fff",
              width: "100%"
            }}
            extraData={this.state}
            data={searchedUsers}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => this._renderUserList(item, index)}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              console.log("search bottom reached");
            }}
            stickyHeaderIndices={[0]}
          />
        );
      }
      return (
        <FlatList
          ListHeaderComponent={this.renderContentHeader}
          extraData={this.state}
          data={followings}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => this._renderUserList(item, index)}
          style={{
            backgroundColor: "#fff",
            width: "100%"
          }}
          onEndReached={() => {
            console.log("following end reached");
          }}
          onEndReachedThreshold={0.1}
          stickyHeaderIndices={[0]}
        />
      );
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={styles.container}
      >
        {this.renderContentView()}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: window.height - Header.HEIGHT - Constants.statusBarHeight,
    width: window.width,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(Mention);
