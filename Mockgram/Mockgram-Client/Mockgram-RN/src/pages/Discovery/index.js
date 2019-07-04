import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { SkypeIndicator } from "react-native-indicators";
import { Header } from "react-navigation";

import SearchBarView from "../../components/SearchBarView";
import PostRecommend from "../Recommend/PostRecommend";
import UserListCell from "../../components/UserListCell";
import TagListCell from "../../components/TagListCell";
import PlaceListCell from "../../components/PlaceListCell";

import baseUrl from "../../common/baseUrl";
import theme from "../../common/theme";
import config from "../../common/config";
import window from "../../utils/getDeviceInfo";
import { parseIdFromObjectArray } from "../../utils/idParser";
import { locale } from "../../common/locale";

class DiscoveryIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * different categories of result array
       * holding search and suggest results
       */
      peopleSuggestResult: [],
      peopleSearchedResult: {
        value: "",
        data: [],
        hasMore: true
      },
      tagSearchedResult: {
        value: "",
        data: [],
        hasMore: true
      },
      placeSearchedResult: {
        value: "",
        data: [],
        hasMore: true
      },

      isSearching: false,
      searchValue: "",
      searchBarInput: "",
      timer: null,
      focused: false,
      activeIndex: 0, // by default the first tab
      activeColor: theme.primaryColor,
      inactiveColor: "black"
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      container: this
    });
  }

  componentDidUpdate(prevProps, prevStates) {
    const { focused, searchBarInput } = this.state;
    if (!prevStates.focused && focused && !searchBarInput) {
      // search bar is focused, hide the recommend page
      this._postRecommend.hide();
    }

    if (prevStates.focused && !focused && !searchBarInput) {
      // search bar lost focus, show the recommend page
      this._postRecommend.show();
    }
  }

  static navigationOptions = ({ navigation }) => {
    let container = navigation.getParam("container");
    if (container) {
      return {
        headerStyle: {
          borderBottomColor: "transparent",
          borderBottomWidth: 0,
          shadowColor: "transparent",
          elevation: 0
        },
        headerTitle: (
          <SearchBarView
            containerStyle={{ width: window.width, height: "80%" }}
            searchBarDefaultWidth={window.width * 0.9}
            searchBarFocusedWidht={window.width * 0.8}
            duration={100}
            rightIonicons={() => {
              return (
                <Ionicons
                  name="md-qr-scanner"
                  size={18}
                  onPress={() => {
                    console.log("scanning");
                  }}
                />
              );
            }}
            onChangeText={text => {
              clearTimeout(container.state.timer);
              container.setState(
                {
                  searchBarInput: text
                },
                () => {
                  if (text.length > 0) {
                    container.setState({
                      isSearching: true,
                      timer: setTimeout(() => {
                        container.setState(
                          {
                            searchValue: text,
                            timer: null
                          },
                          () => {
                            clearTimeout(container.state.timer);
                            container.startSearch();
                          }
                        );
                      }, 1000)
                    });
                  } else {
                    container.setState({
                      isSearching: false,
                      timer: null,
                      searchValue: "",
                      peopleSearchedResult: {
                        value: "",
                        data: [],
                        hasMore: true
                      },
                      tagSearchedResult: {
                        value: "",
                        data: [],
                        hasMore: true
                      },
                      placeSearchedResult: {
                        value: "",
                        data: [],
                        hasMore: true
                      }
                    });
                  }
                }
              );
            }}
            onFocus={() => {
              container.setState({
                focused: true
              });
            }}
            lostFocus={() => {
              container.setState({
                focused: false
              });
            }}
          />
        )
      };
    }
    return null;
  };

  startSearch = () => {
    const { client } = this.props;
    const {
      searchValue,
      peopleSearchedResult,
      tagSearchedResult,
      placeSearchedResult
    } = this.state;
    let category = "";
    let lastQueryData = [];
    if (this.state.activeIndex === 0) {
      category = "people";
      if (searchValue === peopleSearchedResult.value) {
        lastQueryData = [...peopleSearchedResult.data];
      }
    } else if (this.state.activeIndex === 1) {
      category = "tag";
      if (searchValue === tagSearchedResult.value) {
        lastQueryData = [...tagSearchedResult.data];
      }
    } else {
      category = "place";
      if (searchValue === placeSearchedResult.value) {
        lastQueryData = [...placeSearchedResult.data];
      }
    }
    let url = `${baseUrl.api}/discovery/search/${category}`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit: config.SEARCH_RETURN_LIMIT,
        userId: client ? client.user._id : null,
        lastQueryDataIds: parseIdFromObjectArray(lastQueryData),
        searchValue
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          if (category === "people") {
            this.setState({
              peopleSearchedResult: {
                data:
                  resJson.value === this.state.peopleSearchedResult.value
                    ? lastQueryData.concat(resJson.data)
                    : resJson.data,
                value: resJson.value,
                hasMore:
                  resJson.data.length < config.SEARCH_RETURN_LIMIT
                    ? false
                    : true
              },
              isSearching: false
            });
          } else if (category === "tag") {
            this.setState({
              tagSearchedResult: {
                data:
                  resJson.value === this.state.tagSearchedResult.value
                    ? lastQueryData.concat(resJson.data)
                    : resJson.data,
                value: resJson.value,
                hasMore:
                  resJson.data.length < config.SEARCH_RETURN_LIMIT
                    ? false
                    : true
              },
              isSearching: false
            });
          } else {
            this.setState({
              placeSearchedResult: {
                data:
                  resJson.value === this.state.placeSearchedResult.value
                    ? lastQueryData.concat(resJson.data)
                    : resJson.data,
                value: resJson.value,
                hasMore:
                  resJson.data.length < config.SEARCH_RETURN_LIMIT
                    ? false
                    : true
              },
              isSearching: false
            });
          }
        } else {
          this.setState({
            isSearching: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isSearching: false
        });
      });
  };

  activeStyle = index => {
    return this.state.activeIndex === index
      ? this.state.activeColor
      : this.state.inavtiveColor;
  };

  tabSelected = index => {
    const {
      searchValue,
      peopleSearchedResult,
      tagSearchedResult,
      placeSearchedResult
    } = this.state;
    this.setState(
      {
        activeIndex: index
      },
      () => {
        switch (index) {
          case 0:
            if (peopleSearchedResult.value !== searchValue && searchValue) {
              this.setState(
                {
                  isSearching: true
                },
                () => {
                  this.startSearch();
                }
              );
            }
            break;
          case 1:
            if (tagSearchedResult.value !== searchValue && searchValue) {
              this.setState(
                {
                  isSearching: true
                },
                () => {
                  this.startSearch();
                }
              );
            }
            break;
          case 2:
            if (placeSearchedResult.value !== searchValue && searchValue) {
              this.setState(
                {
                  isSearching: true
                },
                () => {
                  this.startSearch();
                }
              );
            }
            break;
          default:
            break;
        }
      }
    );
  };

  renderEmpty = () => {
    const {
      activeIndex,
      isSearching,
      searchValue,
      searchBarInput
    } = this.state;
    const { appLocale } = this.props;
    if (!isSearching && searchValue && searchBarInput) {
      // finished searching, got response.
      switch (activeIndex) {
        case 0:
          return (
            <View style={styles.listEmpty}>
              <Text
                style={{
                  marginLeft: 20,
                  marginTop: 10,
                  fontSize: 13,
                  color: "grey"
                }}
              >
                {`${locale[appLocale]["NO_ACCOUNTS_FOUND"]}`}
              </Text>
            </View>
          );
        case 1:
          return (
            <View style={styles.listEmpty}>
              <Text
                style={{
                  marginLeft: 20,
                  marginTop: 10,
                  fontSize: 13,
                  color: "grey"
                }}
              >
                {`${locale[appLocale]["NO_TAGS_FOUND"]}`}
              </Text>
            </View>
          );
        case 2:
          return (
            <View style={styles.listEmpty}>
              <Text
                style={{
                  marginLeft: 20,
                  marginTop: 10,
                  fontSize: 13,
                  color: "grey"
                }}
              >
                {`${locale[appLocale]["NO_LOCATIONS_FOUND"]}`}
              </Text>
            </View>
          );
        default:
          return null;
      }
    }
  };

  renderFooter = () => {
    const {
      activeIndex,
      peopleSearchedResult,
      tagSearchedResult,
      placeSearchedResult
    } = this.state;
    const { appLocale } = this.props;
    switch (activeIndex) {
      case 0:
        if (peopleSearchedResult.data.length > 0) {
          return (
            <View style={styles.listFooter}>
              {peopleSearchedResult.hasMore ? (
                <SkypeIndicator size={theme.indicatorSm} />
              ) : (
                <Text style={{ color: "grey", fontSize: 12 }}>
                  {`${locale[appLocale]["NO_MORE_USERS"]}`}
                </Text>
              )}
            </View>
          );
        }
        return null;
      case 1:
        if (tagSearchedResult.data.length > 0) {
          return (
            <View style={styles.listFooter}>
              {tagSearchedResult.hasMore ? (
                <SkypeIndicator size={theme.indicatorSm} />
              ) : (
                <Text style={{ color: "grey", fontSize: 12 }}>
                  {`${locale[appLocale]["NO_MORE_TAGS"]}`}
                </Text>
              )}
            </View>
          );
        }
        return null;
      case 2:
        if (placeSearchedResult.data.length > 0) {
          return (
            <View style={styles.listFooter}>
              {placeSearchedResult.hasMore ? (
                <SkypeIndicator size={theme.indicatorSm} />
              ) : (
                <Text style={{ color: "grey", fontSize: 12 }}>
                  {`${locale[appLocale]["NO_MORE_LOCATIONS"]}`}
                </Text>
              )}
            </View>
          );
        }
        return null;
      default:
        return null;
    }
  };

  renderSection = () => {
    // if page is searching for user input
    const {
      isSearching,
      searchValue,
      activeIndex,
      searchBarInput,
      peopleSearchedResult,
      tagSearchedResult,
      placeSearchedResult,
      peopleSuggestResult
    } = this.state;
    const { appLocale } = this.props;
    if (isSearching) {
      return (
        <View
          style={{
            marginTop: 10,
            height: 50,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 13, color: "lightgrey" }}
          >
            {`${locale[appLocale]["SEARCHING"]} ${searchBarInput} ...`}
          </Text>
          <ActivityIndicator size="small" color="lightgrey" />
        </View>
      );
    } else {
      if (searchValue && searchBarInput) {
        // page should search for user input
        switch (activeIndex) {
          case 0:
            return (
              <FlatList
                keyExtractor={item => item._id}
                data={peopleSearchedResult.data}
                renderItem={({ item, index }) => {
                  return <UserListCell key={index} dataSource={item} />;
                }}
                onEndReached={() => {
                  console.log("people reached");
                }}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
              />
            );
          case 1:
            return (
              <FlatList
                keyExtractor={item => item._id}
                data={tagSearchedResult.data}
                renderItem={({ item, index }) => {
                  return <TagListCell key={index} dataSource={item} />;
                }}
                onEndReached={() => {
                  console.log("tag reached");
                }}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
              />
            );

          case 2:
            return (
              <FlatList
                keyExtractor={item => item._id}
                data={placeSearchedResult.data}
                renderItem={({ item, index }) => {
                  return <PlaceListCell key={index} dataSource={item} />;
                }}
                onEndReached={() => {
                  console.log("place reached");
                }}
                onEndReachedThreshold={0.1}
                ListEmptyComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
              />
            );
          default:
            return null;
        }
      } else {
        // page should show suggest to user
        return (
          <FlatList
            data={peopleSuggestResult}
            renderItem={({ item, index }) => {
              return <UserListCell key={index} dataSource={item} />;
            }}
            keyExtractor={item => item._id}
          />
        );
      }
    }
  };

  renderSuggestedLabel = () => {
    const { appLocale } = this.props;
    return (
      <View style={styles.listEmpty}>
        <Text
          style={{
            marginLeft: 20,
            fontSize: 15,
            fontWeight: "bold",
            color: "black"
          }}
        >
          {locale[appLocale]["SUGGEST"]}
        </Text>
      </View>
    );
  };

  renderTabBar = tabBarArray => {
    const { activeIndex } = this.state;
    return (
      <View style={styles.tabBarTop}>
        {tabBarArray.map((tabName, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.tabBarTab}
              onPress={() => {
                this.tabSelected(index);
              }}
            >
              <Text style={{ fontSize: 15, color: this.activeStyle(index) }}>
                {tabName}
              </Text>
              {activeIndex === index ? (
                <View style={styles.tabUnderline} />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  renderContentHeader = () => {
    const { searchBarInput, searchValue, focused } = this.state;
    const { appLocale } = this.props;
    return (
      <View
        style={{
          width: window.width,
          justifyContent: "flex-start",
          alignItems: "flex-start"
        }}
      >
        {this.renderTabBar([
          `${locale[appLocale]["PEOPLE"]}`,
          `${locale[appLocale]["TAG"]}`,
          `${locale[appLocale]["PLACE"]}`
        ])}
        {focused && !searchBarInput && !searchValue
          ? this.renderSuggestedLabel()
          : null}
      </View>
    );
  };

  renderContentView = () => {
    return (
      <View style={styles.tabView}>
        {this.renderContentHeader()}
        {this.renderSection()}
      </View>
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={[styles.content, { zIndex: 1 }]}>
            {this.renderContentView()}
          </View>
          <PostRecommend
            onRef={o => (this._postRecommend = o)}
            style={{ opacity: 1, zIndex: 1 }}
          />
        </View>
      </TouchableWithoutFeedback>
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
)(DiscoveryIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  tabBarTop: {
    flexDirection: "row",
    flexWrap: "nowrap",
    height: window.height * 0.08,
    width: "100%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.5,
    justifyContent: "space-between"
  },
  tabBarTab: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    backgroundColor: theme.primaryColor,
    width: "50%",
    height: "5%",
    left: "25%"
  },
  tabView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginTop: 0
  },
  listFooter: {
    alignItems: "center",
    justifyContent: "center",
    height: 2 * Header.HEIGHT
  },
  listEmpty: {
    width: window.width,
    height: window.height * 0.08,
    justifyContent: "center",
    alignItems: "flex-start"
  }
});
