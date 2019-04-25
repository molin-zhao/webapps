import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import { Header } from "react-navigation";
import { SkypeIndicator } from "react-native-indicators";
import { createStackNavigator } from "react-navigation";

import SearchBarView from "../../components/SearchBarView";
import TagLabel from "../../components/TagLabel";
import CreateTag from "./CreateTag";
import CreateTopic from "./CreateTopic";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import theme from "../../common/theme";
import { numberConverter } from "../../utils/unitConverter";
import { parseIdFromObjectArray } from "../../utils/idParser";

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // indicator properties
      isSearching: false,
      searchValue: "",
      returnValue: "",
      hotTagLoading: false,
      hotTopicLoading: false,
      recommendLoading: false,
      hasMore: true,
      loadingMore: false,

      // data
      selectedTags: this.props.navigation.getParam("selectedTags", {}),
      hotTags: {},
      hotTopics: {},
      searchedTags: [],
      suggestedTags: [],
      error: null
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0
    },
    title: "Add Tags",
    headerTitleStyle: {
      fontSize: 14
    },
    headerLeft: (
      <TouchableOpacity
        style={{ marginLeft: 20 }}
        onPress={() => {
          let passSelectedTagsBack = navigation.getParam(
            "passSelectedTagsBack"
          );
          let getSelectedTags = navigation.getParam("getSelectedTags");
          passSelectedTagsBack(getSelectedTags());
          navigation.popToTop();
        }}
      >
        <Icon name="chevron-left" size={20} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    this.props.navigation.setParams({
      getSelectedTags: () => this.state.selectedTags
    });
    this.setState(
      {
        hotTagLoading: true,
        hotTopicLoading: true,
        recommendLoading: true
      },
      () => {
        this.fetchRecommendTags();
        this.fetchHotTags();
        this.fetchHotTopics();
      }
    );
  }

  _renderTagListCellBtn = id => {
    const { selectedTags } = this.state;
    if (Object.keys(selectedTags).includes(id)) {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <Text style={{ color: "grey" }}>Added</Text>
          <Ionicon
            name="ios-checkmark"
            size={theme.iconSm}
            style={{ marginLeft: 2 }}
            color="grey"
          />
        </View>
      );
    }
    return <Text>Add</Text>;
  };

  tagListCell = item => {
    const { selectedTags } = this.state;
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: window.width,
          height: 50
        }}
      >
        <View
          style={{
            flex: 4,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row"
          }}
        >
          <Icon style={{ marginLeft: 15 }} name="hashtag" size={theme.iconSm} />
          <Text style={{ marginLeft: 5, fontSize: 13, fontWeight: "bold" }}>
            {item.name}
          </Text>
          <Text
            style={{ marginLeft: 5, fontSize: 12, color: "grey" }}
          >{`${numberConverter(item.quotedCount)} posts`}</Text>
          <Text
            style={{ marginLeft: 5, fontSize: 12, color: "grey" }}
          >{`${numberConverter(item.participantsCount)} people`}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!Object.keys(selectedTags).includes(item._id)) {
              this.addToSelectedTags(item);
            }
          }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this._renderTagListCellBtn(item._id)}
        </TouchableOpacity>
      </View>
    );
  };

  fetchRecommendTags = () => {
    return fetch(
      `${baseUrl.api}/discovery/recommend/tag?limit=${
        config.hotTagAndTopicLimit
      }`,
      {
        method: "GET"
      }
    )
      .then(res => res.json())
      .then(resJson => {
        this.setState({
          recommendLoading: false
        });
      })
      .catch(err => {
        this.setState({
          recommendLoading: false,
          error: err
        });
      });
  };

  fetchHotTopics = () => {
    return fetch(
      `${baseUrl.api}/discovery/topic/hot?limit=${config.hotTagAndTopicLimit}`,
      { method: "GET" }
    )
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          this.setState({
            hotTopics: resJson.topic
          });
        } else {
          this.setState({
            error: resJson.msg
          });
        }
      })
      .then(() => {
        this.setState({
          hotTopicLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: err,
          hotTopicLoading: false
        });
      });
  };

  fetchHotTags = () => {
    return fetch(
      `${baseUrl.api}/discovery/tag/hot?limit=${config.hotTagAndTopicLimit}`,
      { method: "GET" }
    )
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          this.setState({
            hotTags: resJson.tag
          });
        } else {
          this.setState({
            error: resJson.msg
          });
        }
      })
      .then(() => {
        this.setState({
          hotTagLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: err,
          hotTagLoading: false
        });
      });
  };

  startSearch = () => {
    const { searchValue, searchedTags, returnValue } = this.state;
    // if last query returned value equals this query search value
    // two queries' values are same -> loading more
    let isLoadingMore = returnValue === searchValue;
    return fetch(`${baseUrl.api}/post/search/tag`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        value: searchValue,
        limit: config.tagLimit,
        lastQueryDataIds: isLoadingMore
          ? parseIdFromObjectArray(searchedTags)
          : []
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          this.setState({
            searchedTags:
              this.state.returnValue === this.state.searchValue
                ? this.state.searchedTags.concat(resJson.data)
                : resJson.data,
            returnValue: resJson.value,
            hasMore: resJson.data.length < config.tagLimit ? false : true
          });
        } else {
          this.setState({
            error: resJson.msg,
            returnValue: "",
            hasMore: false
          });
        }
      });
  };

  _renderHotTags = () => {
    const { hotTags, hotTagLoading, selectedTags } = this.state;
    if (hotTagLoading) {
      return (
        <View style={styles.sectionEmpty}>
          <SkypeIndicator size={25} />
        </View>
      );
    }
    if (hotTags.err) {
      return (
        <View style={styles.sectionEmpty}>
          <Text>Request Popular Tags Error</Text>
        </View>
      );
    }
    if (hotTags.data && hotTags.data.length > 0) {
      return (
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: "98%",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          {hotTags.data.map(item => {
            return (
              <TagLabel
                key={item._id}
                dataSource={item}
                selected={Object.keys(selectedTags).includes(item._id)}
                onPress={() => {
                  this.addToSelectedTags(item);
                }}
              />
            );
          })}
        </View>
      );
    }
    return (
      <View style={styles.sectionEmpty}>
        <Text>No Popular Tags</Text>
      </View>
    );
  };

  _renderHotTopics = () => {
    const { hotTopics, hotTopicLoading, selectedTags } = this.state;
    if (hotTopicLoading) {
      return (
        <View style={styles.sectionEmpty}>
          <SkypeIndicator size={25} />
        </View>
      );
    }
    if (hotTopics.err) {
      return (
        <View style={styles.sectionEmpty}>
          <Text>Request Popular Topics Error</Text>
        </View>
      );
    }

    if (hotTopics.data && hotTopics.data.length > 0) {
      return (
        <FlatList
          extraData={this.state}
          data={hotTopics.data}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  marginTop: 10,
                  width: window.width * 0.98,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "flex-start" }}
                >
                  <TagLabel
                    key={item._id}
                    dataSource={item}
                    selected={Object.keys(selectedTags).includes(item._id)}
                    onPress={() => {
                      this.addToSelectedTags(item);
                    }}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 10,
                      marginTop: 10,
                      fontSize: 12,
                      color: "grey"
                    }}
                  >{`${numberConverter(
                    item.participantsCount
                  )} people participated`}</Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      marginTop: 10,
                      width: "90%"
                    }}
                    ellipsizeMode="tail"
                    numberOfLines={3}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          }}
          keyExtractor={item => item._id}
        />
      );
    }
    return (
      <View style={styles.sectionEmpty}>
        <Text>No Popular Topics</Text>
      </View>
    );
  };

  _renderFooter = () => {
    const { loadingMore, hasMore } = this.state;
    if (loadingMore || hasMore) {
      return <SkypeIndicator size={theme.iconSm} color="grey" />;
    }
    return (
      <View
        style={{
          height: 80,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ color: "grey", fontSize: 12 }}>
          {" "}
          - No more relevant tags -{" "}
        </Text>
      </View>
    );
  };

  _renderSearchResults = () => {
    const {
      isSearching,
      searchBarInput,
      searchedTags,
      suggestedTags
    } = this.state;
    if (isSearching) {
      return (
        <View style={styles.searchingIndicator}>
          <Text
            style={{ fontWeight: "bold", fontSize: 13, color: "lightgrey" }}
          >
            Searching for {searchBarInput} ...
          </Text>
          <ActivityIndicator size="small" color="lightgrey" />
        </View>
      );
    } else {
      if (searchBarInput && searchedTags.length !== 0) {
        return (
          <FlatList
            extraData={this.state}
            data={searchedTags}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
              return this.tagListCell(item);
            }}
            ListFooterComponent={this._renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.1}
          />
        );
      }
      return (
        <FlatList
          data={suggestedTags}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.name}</Text>
              </View>
            );
          }}
        />
      );
    }
  };

  renderHotTagsAndTopics = () => {
    const { navigation } = this.props;
    return (
      <View
        style={{
          width: window.width,
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <View style={styles.sectionLabel}>
              <Ionicon name="md-bonfire" size={theme.iconSm} />
              <Text style={{ marginLeft: 10 }}>Popular tags</Text>
            </View>
            <Icon
              name="plus"
              style={{ marginRight: 10 }}
              size={theme.iconSm}
              onPress={() => {
                navigation.navigate("CreateTag");
              }}
            />
          </View>
          {this._renderHotTags()}
        </View>
        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <View style={styles.sectionLabel}>
              <Ionicon name="ios-people" size={theme.iconSm} />
              <Text style={{ marginLeft: 10 }}>Popular topics</Text>
            </View>
            <Icon
              name="plus"
              style={{ marginRight: 10 }}
              size={theme.iconSm}
              onPress={() => {
                navigation.navigate("CreateTopic");
              }}
            />
          </View>
          {this._renderHotTopics()}
        </View>
      </View>
    );
  };

  renderSelectedTags = () => {
    const { selectedTags } = this.state;
    if (Object.keys(selectedTags).length > 0) {
      return (
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: "98%",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start"
          }}
        >
          {Object.values(selectedTags).map(item => {
            return (
              <TagLabel
                key={item._id}
                dataSource={item}
                defaultContainerStyle={{ backgroundColor: theme.primaryColor }}
                defaultLabelStyle={{ color: "#fff" }}
                button={() => {
                  return (
                    <Icon
                      name="times"
                      color={theme.primaryGrey}
                      size={theme.iconSm}
                      style={{ marginLeft: 5 }}
                    />
                  );
                }}
                onPress={() => {
                  this.removeFromSelectedTags(item);
                }}
              />
            );
          })}
        </View>
      );
    }
    return null;
  };

  renderSearchResultView = () => {
    const { focused, searchBarInput } = this.state;
    if (focused || searchBarInput) {
      return (
        <View
          style={{
            width: window.width,
            flex: 1,
            zIndex: 1,
            backgroundColor: "#fff",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          {this._renderSearchResults()}
        </View>
      );
    }
    return (
      <ScrollView
        contentContainerStyle={{
          width: window.width,
          flex: 1,
          backgroundColor: "#fff"
        }}
      >
        {this.renderHotTagsAndTopics()}
      </ScrollView>
    );
  };

  addToSelectedTags = tag => {
    let tagId = tag._id;
    const { selectedTags } = this.state;
    if (Object.keys(selectedTags).length < 10) {
      selectedTags[tagId] = tag;
      this.setState({
        selectedTags
      });
    }
  };

  removeFromSelectedTags = tag => {
    let tagId = tag._id;
    const { selectedTags } = this.state;
    if (Object.keys(selectedTags).includes(tagId)) {
      delete selectedTags[tagId];
      this.setState({
        selectedTags
      });
    }
  };

  handleLoadMore = () => {
    const { hasMore, loadingMore, isSearching } = this.state;
    if (!isSearching && !loadingMore && hasMore) {
      this.setState(
        {
          loadingMore: true
        },
        () => {
          this.startSearch()
            .then(() => {
              this.setState({
                loadingMore: false
              });
            })
            .catch(err => {
              this.setState({
                loadingMore: false,
                error: err
              });
            });
        }
      );
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          {this.renderSelectedTags()}
          <View style={{ width: "100%", height: Header.HEIGHT }}>
            <SearchBarView
              containerStyle={{ width: window.width, height: "80%" }}
              searchBarDefaultWidth={window.width * 0.9}
              searchBarFocusedWidht={window.width * 0.8}
              duration={100}
              onChangeText={text => {
                clearTimeout(this.state.timer);
                this.setState(
                  {
                    searchBarInput: text
                  },
                  () => {
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
                  }
                );
              }}
              onFocus={() => {
                this.setState({
                  focused: true
                });
              }}
              lostFocus={() => {
                this.setState({
                  focused: false
                });
              }}
              rightIcon={() => {
                return (
                  <Text style={{ fontWeight: "bold", fontSize: 12 }}>{`${
                    Object.keys(this.state.selectedTags).length
                  }/${config.tagLimit}`}</Text>
                );
              }}
            />
          </View>
          {this.renderSearchResultView()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: window.width
  },
  section: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  sectionTitle: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    height: window.height * 0.05,
    backgroundColor: theme.primaryGrey,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1
  },
  sectionLabel: {
    marginLeft: theme.paddingToWindow,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  sectionEmpty: {
    width: "100%",
    height: window.height * 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  searchingIndicator: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default createStackNavigator(
  {
    Tag,
    CreateTag,
    CreateTopic
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
