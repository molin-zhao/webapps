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

import SearchBarView from "../../components/SearchBarView";
import TagCell from "../../components/TagListCell";
import TagLabel from "../../components/TagLabel";
import Modal from "../../components/Modal";
import AjaxInput from "../../components/AjaxInput";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import theme from "../../common/theme";

const modalStyle = {
  width: window.width,
  height: window.height * 0.3,
  borderTopWidth: 1,
  borderTopColor: "lightgrey",
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  backgroundColor: "#fff",
  justifyContent: "flex-start",
  alignItems: "center"
};

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // indicator properties
      isSearching: false,
      searchValue: "",
      searchBarInput: "",
      timer: null,
      focused: false,
      loading: false,
      error: null,
      addTagModalVisible: false,
      addActivityModalVisible: false,

      // data properties
      selectedTags: {},
      hotTags: {},
      hotActivities: {},
      searchedTags: [],
      suggestedTags: []
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
          navigation.goBack();
        }}
      >
        <Icon name="chevron-left" size={20} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    this.setState(
      {
        loading: true
      },
      () => {
        this.fetchRecommendTags();
        this.fetchHotTagsAndActivities();
      }
    );
  }
  fetchRecommendTags = () => {
    return fetch(
      `${baseUrl.api}/discovery/recommend/tag?limit=${
        config.hotTagAndActivityLimit
      }`,
      {
        method: "GET"
      }
    )
      .then(res => res.json())
      .then(resJson => {
        console.log(resJson);
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchHotTagsAndActivities = () => {
    return fetch(
      `${baseUrl.api}/discovery/hot/alltypes?limit=${
        config.hotTagAndActivityLimit
      }`,
      { method: "GET" }
    )
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          this.setState({
            hotTags: resJson.tag,
            hotActivities: resJson.activity
          });
        } else {
          this.setState({
            error: resJson.msg
          });
        }
      })
      .then(() => {
        this.setState({
          loading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          error: err,
          loading: false
        });
      });
  };

  startSearch = () => {
    console.log(`start searching for ${this.state.searchValue}`);
  };

  _renderHotTags = () => {
    const { hotTags } = this.state;
    if (hotTags.err) {
      return (
        <View style={styles.sectionEmpty}>
          <Text>Request Popular Tags Error</Text>
        </View>
      );
    } else {
      if (hotTags.data && hotTags.data.length > 0) {
        return (
          <FlatList
            data={hotTags.data}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text>{item.name}</Text>
                </View>
              );
            }}
            keyExtractor={item => item._id}
          />
        );
      }
      return (
        <View style={styles.sectionEmpty}>
          <Text>No Popular Tags</Text>
        </View>
      );
    }
  };

  _renderHotActivities = () => {
    const { hotActivities } = this.state;
    if (hotActivities.err) {
      return (
        <View style={styles.sectionEmpty}>
          <Text>Request Popular Activities Error</Text>
        </View>
      );
    } else {
      if (hotActivities.data && hotActivities.data.length > 0) {
        return (
          <FlatList
            data={hotActivities.data}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text>{item.name}</Text>
                </View>
              );
            }}
            keyExtractor={item => item._id}
          />
        );
      }
      return (
        <View style={styles.sectionEmpty}>
          <Text>No Popular Activities</Text>
        </View>
      );
    }
  };

  _renderSearchReesults = () => {
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
      if (!searchBarInput && searchedTags.length === 0) {
        return (
          <FlatList
            data={searchedTags}
            keyExtractor={item => item._id}
            renderItem={item => {
              return (
                <View>
                  <Text>{item.name}</Text>
                </View>
              );
            }}
          />
        );
      }
      return (
        <FlatList
          data={suggestedTags}
          keyExtractor={item => item._id}
          renderItem={item => {
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

  renderHotTagsAndActivities = () => {
    const { loading, addActivityModalVisible, addTagModalVisible } = this.state;
    if (loading) {
      return <SkypeIndicator size={40} />;
    } else {
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
                  if (!addTagModalVisible) {
                    this.setState({
                      addTagModalVisible: true
                    });
                  }
                }}
              />
            </View>
            {this._renderHotTags()}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <View style={styles.sectionLabel}>
                <Ionicon name="ios-people" size={theme.iconSm} />
                <Text style={{ marginLeft: 10 }}>Popular activities</Text>
              </View>
              <Icon
                name="plus"
                style={{ marginRight: 10 }}
                size={theme.iconSm}
                onPress={() => {
                  if (!addActivityModalVisible) {
                    this.setState({
                      addActivityModalVisible: true
                    });
                  }
                }}
              />
            </View>
            {this._renderHotActivities()}
          </View>
        </View>
      );
    }
  };

  renderSelectedTags = () => {
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
          {this._renderSearchReesults()}
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
        {this.renderHotTagsAndActivities()}
      </ScrollView>
    );
  };

  renderAddTagModal = () => {
    return <Modal visible={this.state.addTagModalVisible} style={modalStyle} />;
  };

  renderAddActivityModal = () => {
    return (
      <Modal visible={this.state.addActivityModalVisible} style={modalStyle} />
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          this.setState({
            addActivityModalVisible: false,
            addTagModalVisible: false
          });
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            {this.renderSelectedTags()}
          </View>
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
                              this.startSearch();
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
          {this.renderAddTagModal()}
          {this.renderAddActivityModal()}
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

export default Tag;
