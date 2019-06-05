import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  FlatList
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
import SectionTitle from "../../components/SectionTitle";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import theme from "../../common/theme";
import { numberConverter } from "../../utils/unitConverter";
import { parseIdFromObjectArray } from "../../utils/idParser";

class Tag extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      // indicator properties
      isSearching: false,
      searchValue: "",
      returnValue: "",
      loading: false,
      hasMore: true,
      loadingMore: false,

      // data
      selectedTags: this.props.navigation.getParam("selectedTags", {}),
      hotTagAndTopic: [],
      searchedTags: [],
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
          navigation.popToTop();
        }}
      >
        <Icon name="chevron-left" size={20} />
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
          let passSelectedTagsBack = navigation.getParam(
            "passSelectedTagsBack"
          );
          let getSelectedTags = navigation.getParam("getSelectedTags");
          passSelectedTagsBack(getSelectedTags());
          navigation.popToTop();
        }}
      >
        <Text style={{ color: "#fff", fontSize: 12 }}>Done</Text>
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    this.mounted = true;
    this.props.navigation.setParams({
      getSelectedTags: () => this.state.selectedTags
    });
    this.setState(
      {
        loading: true
      },
      () => {
        this.fetchHotTagsAndTopics();
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
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

  fetchHotTagsAndTopics = () => {
    return fetch(
      `${baseUrl.api}/discovery/tag-topic/hot?limit=${
        config.HOT_TAG_TOPIC_RETURN_LIMIT
      }`,
      { method: "GET" }
    )
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          if (this.mounted) {
            this.setState({
              hotTagAndTopic: resJson.data
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
            loading: false
          });
        }
      })
      .catch(err => {
        if (this.mounted) {
          this.setState({
            error: err,
            loading: false
          });
        }
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
        limit: config.SEARCH_RETURN_LIMIT,
        lastQueryDataIds: isLoadingMore
          ? parseIdFromObjectArray(searchedTags)
          : []
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          if (this.mounted) {
            this.setState({
              searchedTags:
                this.state.returnValue === this.state.searchValue
                  ? this.state.searchedTags.concat(resJson.data)
                  : resJson.data,
              returnValue: resJson.value,
              hasMore:
                resJson.data.length < config.HOT_TAG_TOPIC_RETURN_LIMIT
                  ? false
                  : true
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

  _renderHotTagsAndTopicsSection = itemObject => {
    const { selectedTags } = this.state;
    if (itemObject.type === "tag") {
      if (itemObject.data && itemObject.data.length > 0) {
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
            {itemObject.data.map(item => {
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
    } else {
      if (itemObject.data && itemObject.data.length > 0) {
        return (
          <FlatList
            extraData={this.state}
            data={itemObject.data}
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
                    style={{
                      justifyContent: "center",
                      alignItems: "flex-start"
                    }}
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
    }
  };

  renderHotTagsAndTopics = () => {
    const { navigation } = this.props;
    const { hotTagAndTopic } = this.state;
    return (
      <FlatList
        data={hotTagAndTopic}
        keyExtractor={item => item.type}
        ListHeaderComponent={this.renderContentHeader}
        stickyHeaderIndices={[0]}
        renderItem={({ item, index }) => {
          return (
            <View key={index} style={styles.section}>
              <SectionTitle
                iconLabel={() => (
                  <Ionicon
                    name={item.type === "tag" ? "ios-bonfire" : "ios-people"}
                    size={theme.iconSm}
                  />
                )}
                iconRight={() => (
                  <Icon
                    name="plus"
                    style={{ marginRight: 10 }}
                    size={theme.iconSm}
                    onPress={() => {
                      if (item.type === "tag") {
                        navigation.navigate("CreateTag");
                      } else {
                        navigation.navigate("CreateTopic");
                      }
                    }}
                  />
                )}
                label={`Popular ${item.type}(s)`}
              />
              {this._renderHotTagsAndTopicsSection(item)}
            </View>
          );
        }}
      />
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
                    <Ionicon
                      name="md-close"
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

  renderContentHeader = () => {
    return (
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#fff"
        }}
      >
        {this.renderSelectedTags()}
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
            rightIcon={() => {
              return (
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>{`${
                  Object.keys(this.state.selectedTags).length
                }/${config.TAG_SELECT_LIMIT}`}</Text>
              );
            }}
          />
        </View>
      </View>
    );
  };

  renderContentView = () => {
    const { searchValue, searchedTags } = this.state;
    if (searchValue && searchedTags) {
      return (
        <FlatList
          ListHeaderComponent={this.renderContentHeader}
          stickyHeaderIndices={[0]}
          extraData={this.state}
          data={searchedTags}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return this.tagListCell(item);
          }}
          ListFooterComponent={() => {
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
                  {` - No more relevant tags - `}
                </Text>
              </View>
            );
          }}
          onEndReached={() => {
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
          }}
          onEndReachedThreshold={0.1}
        />
      );
    }
    return this.renderHotTagsAndTopics();
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