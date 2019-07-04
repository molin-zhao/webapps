import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import { connect } from "react-redux";
import { Header } from "react-navigation";

import PostCardComponent from "../../components/PostCardComponent";

import {
  updateHomeFeed,
  reloadHomeFeed
} from "../../redux/actions/feedActions";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import theme from "../../common/theme";
import { locale } from "../../common/locale";
import window from "../../utils/getDeviceInfo";
import { parseIdFromObjectArray } from "../../utils/idParser";
import UserRecommend from "../Recommend/UserRecommend";

class HomeIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      hasMore: true,
      loading: false,
      refreshing: false,
      loadingMore: false,
      fetching: false,
      interrupt: false,
      gotServerResponse: false
    };
  }

  static navigationOptions = () => {
    return {
      title: "Mockgram",
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      headerTitleStyle: {
        color: "black",
        fontSize: 20
      }
    };
  };
  componentDidMount() {
    const { initialized, navigation } = this.props;
    if (!initialized) {
      navigation.push("InitPage");
    }
  }

  componentDidUpdate(prevProps) {
    const { client, initialized } = this.props;
    if (!prevProps.initialized && initialized) {
      // app initialized for the first time
      this.setState(
        {
          loading: true
        },
        () => {
          console.log("loading");
          this.fetchPosts();
        }
      );
    } else {
      // app uninitialized or from initialized to uninitialized
      if (initialized && client != prevProps.client) {
        this.handleReload();
      }
    }
  }

  fetchPosts = () => {
    /**
     * status is one of refreshing, loading and lodingMore
     * use status to check if the network request is interrupted
     * the criteria is the value of status has been changed after receving server response
     * */
    const { homeFeed, updateFeed, loadOrReloadFeed } = this.props;
    const url = `${baseUrl.api}/post`;
    const { client } = this.props;
    this.setState(
      {
        fetching: true
      },
      () => {
        console.log(`fetching data from ${url}`);
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            limit: config.POST_RETURN_LIMIT,
            userId: client ? client.user._id : null,
            lastQueryDataIds: this.state.loadingMore
              ? parseIdFromObjectArray(homeFeed)
              : []
          })
        })
          .then(res => res.json())
          .then(res => {
            if (!this.state.interrupt) {
              this.setState(
                {
                  error: res.status === 200 ? null : res.msg,
                  hasMore:
                    res.data.length < config.POST_RETURN_LIMIT ? false : true
                },
                () => {
                  if (this.state.loadingMore) {
                    updateFeed(res.data);
                  } else {
                    loadOrReloadFeed(res.data);
                  }
                }
              );
            } else {
              this.setState({
                interrupt: false
              });
            }
          })
          .then(() => {
            this.setState({
              loading: false,
              refreshing: false,
              loadingMore: false,
              fetching: false,
              gotServerResponse: true
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({
              error: err,
              loading: false,
              refreshing: false,
              loadingMore: false,
              fetching: false,
              interrupt: false
            });
          });
      }
    );
  };

  handleReload = () => {
    /**
     *  reload should have highest priority than loading more and refreshing
     *  do not need to check if page is requesting for loading more or refreshing
     *  interrupt other network requests by setting status to false
     */
    if (this.state.fetching) {
      this.setState({
        interrupt: true
      });
    }
    this.setState(
      {
        loading: true,
        refreshing: false,
        loadingMore: false
      },
      () => {
        this.fetchPosts();
      }
    );
  };

  handleRefresh = () => {
    /**
     *  refresh should have higher priority than load more
     *  if this page is refreshing or loading, disable refresh
     *  otherwise anable refresh
     *  */
    if (!this.state.refreshing && !this.state.loading) {
      if (this.state.fetching) {
        this.setState({
          interrupt: true
        });
      }
      this.setState(
        {
          refreshing: true,
          loading: false,
          loadingMore: false
        },
        () => {
          console.log("refreshing");
          this.fetchPosts();
        }
      );
    }
  };

  handleLoadMore = () => {
    // only loading more when request resource has more data and page is not loading, refreshing and loading more beforehand
    if (
      this.state.hasMore &&
      !this.state.refreshing &&
      !this.state.loading &&
      !this.state.loadingMore &&
      !this.state.fetching
    ) {
      this.setState(
        {
          loadingMore: true,
          refreshing: false,
          loding: false
        },
        () => {
          console.log("loading more");
          this.fetchPosts();
        }
      );
    }
  };

  renderFooter = () => {
    const { loading, loadingMore, refreshing, hasMore } = this.state;
    const { homeFeed, initialized, appLocale } = this.props;
    if (initialized) {
      if (!loading && !loadingMore && !refreshing && homeFeed.length === 0) {
        return null;
      }
      return (
        <View style={styles.listFooter}>
          {hasMore ? (
            <SkypeIndicator size={theme.indicatorSm} />
          ) : (
            <Text style={{ color: "grey", fontSize: 12 }}>{`- ${
              locale[appLocale]["NO_MORE_POSTS"]
            } -`}</Text>
          )}
        </View>
      );
    }
    return null;
  };

  listEmpty = () => {
    const { fetching, error, gotServerResponse } = this.state;
    if (gotServerResponse && !fetching) {
      if (error) {
        return this.renderError();
      } else {
        return <UserRecommend />;
      }
    }
    return null;
  };

  renderError = () => {
    const { error } = this.state;
    const { appLocale } = this.state;
    return (
      <View style={styles.errorMsgView}>
        {error.sourceURL ? (
          <Text>{locale[appLocale]["NETWORK_REQUEST_ERROR"]}</Text>
        ) : (
          <Text>{error}</Text>
        )}
      </View>
    );
  };

  renderLoading = () => {
    return (
      <View style={styles.errorMsgView}>
        <SkypeIndicator size={theme.indicatorLg} />
      </View>
    );
  };

  renderPost = () => {
    const { initialized, homeFeed } = this.props;
    if (initialized) {
      if (this.state.loading) {
        return this.renderLoading();
      } else {
        if (this.state.error) {
          return this.renderError();
        }
        return (
          <FlatList
            style={{ marginTop: 0, width: "100%", backgroundColor: "#fff" }}
            contentContainerStyle={{ backgroundColor: "#fff" }}
            data={homeFeed}
            renderItem={({ item }) => <PostCardComponent dataSource={item} />}
            ListEmptyComponent={this.listEmpty}
            keyExtractor={item => item._id}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.1}
          />
        );
      }
    } else {
      return this.renderLoading();
    }
  };

  render() {
    return <View style={styles.contentContainer}>{this.renderPost()}</View>;
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  initialized: state.app.initialized,
  homeFeed: state.feed.homeFeed,
  appLocale: state.app.appLocale
});

const mapDispatchToProps = dispatch => ({
  loadOrReloadFeed: feeds => dispatch(reloadHomeFeed(feeds)),
  updateFeed: feeds => dispatch(updateHomeFeed(feeds))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeIndex);

const styles = StyleSheet.create({
  contentContainer: {
    height: window.height - Header.HEIGHT,
    width: window.width,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 0
  },
  listFooter: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: 2 * Header.HEIGHT
  },
  errorMsgView: {
    backgroundColor: "#fff",
    height: window.height - 2 * Header.HEIGHT,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
});
