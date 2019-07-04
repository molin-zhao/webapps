import React from "react";
import {
  StyleSheet,
  Animated,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from "react-native";
import { withNavigation, Header } from "react-navigation";
import { Constants } from "expo";
import PropTypes from "prop-types";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { SkypeIndicator } from "react-native-indicators";

import RecommendGridViewImage from "../../components/RecommendGridViewImage";

import window from "../../utils/getDeviceInfo";
import baseUrl from "../../common/baseUrl";
import config from "../../common/config";
import { parseIdFromObjectArray } from "../../utils/idParser";
import { normalizeData } from "../../utils/arrayEditor";
import { locale } from "../../common/locale";

const numColumns = 3;

class PostRecommend extends React.Component {
  mounted = false;
  static defaultProps = {
    animationDuration: 200,
    style: {
      opacity: 0,
      zIndex: 0
    }
  };

  static propTypes = {
    animationDuration: PropTypes.number,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(this.props.style.opacity),
      zIndex: new Animated.Value(this.props.style.zIndex),
      refreshing: false,
      loading: false,
      data: [],
      loadingMore: false,
      hasMore: true,
      fetching: false,
      interrupt: false,
      error: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.setState(
      {
        loading: true
      },
      () => {
        this.fetchPosts();
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    const { client } = this.props;

    // app uninitialized or from initialized to uninitialized
    if (client != prevProps.client) {
      this.handleReload();
    }
  }

  fetchPosts = () => {
    /**
     * status is one of refreshing, loading and lodingMore
     * use status to check if the network request is interrupted
     * the criteria is the value of status has been changed after receving server response
     * */
    const url = `${baseUrl.api}/recommend/post`;
    const { client } = this.props;
    const { data, loadingMore } = this.state;
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
            limit: config.RECOMMENDED_POST_RETURN_LIMIT,
            userId: client ? client.user._id : null,
            lastQueryDataIds: loadingMore ? parseIdFromObjectArray(data) : []
          })
        })
          .then(res => res.json())
          .then(resJson => {
            if (this.mounted) {
              if (!this.state.interrupt) {
                this.setState({
                  error: resJson.status === 200 ? null : resJson.msg,
                  hasMore:
                    resJson.data.length < config.RECOMMENDED_POST_RETURN_LIMIT
                      ? false
                      : true,
                  data: loadingMore ? data.concat(resJson.data) : resJson.data
                });
              } else {
                this.setState({
                  interrupt: false
                });
              }
            }
          })
          .then(() => {
            if (this.mounted) {
              this.setState({
                loading: false,
                refreshing: false,
                loadingMore: false,
                fetching: false
              });
            }
          })
          .catch(err => {
            console.log(err);
            if (this.mounted) {
              this.setState({
                error: err,
                loading: false,
                refreshing: false,
                loadingMore: false,
                fetching: false,
                interrupt: false
              });
            }
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
    const { loading, loadingMore, refreshing, hasMore, data } = this.state;
    const { appLocale } = this.props;
    if (!loading && !loadingMore && !refreshing && data.length === 0) {
      return null;
    }
    return (
      <View style={styles.listFooter}>
        {hasMore ? (
          <SkypeIndicator size={25} />
        ) : (
          <Text style={{ color: "grey", fontSize: 12 }}>
            {`${locale[appLocale]["NO_MORE_POSTS"]}`}
          </Text>
        )}
      </View>
    );
  };

  listEmpty = () => {
    const { fetching, error } = this.state;
    if (!fetching && error) {
      return this.renderError();
    }
    return null;
  };

  renderError = () => {
    const { error } = this.state;
    const { appLocale } = this.props;
    return (
      <View style={styles.errorMsgView}>
        <Text>
          {error.sourceURL
            ? `${locale[appLocale]["NETWORK_REQUEST_ERROR"]}`
            : error}
        </Text>
      </View>
    );
  };

  renderLoading = () => {
    return (
      <View style={styles.errorMsgView}>
        <SkypeIndicator />
      </View>
    );
  };

  renderHeader = () => {
    const { appLocale } = this.props;
    return (
      <View style={styles.sectionHeader}>
        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            console.log("nearby");
          }}
        >
          <Ionicons name="ios-pin" size={16} />
          <Text style={{ fontSize: 12 }}>{`${
            locale[appLocale]["NEARBY"]
          }`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            console.log("hot");
          }}
        >
          <Ionicons name="ios-flame" size={16} />
          <Text style={{ fontSize: 12 }}>{`${locale[appLocale]["HOT"]}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.section}
          onPress={() => {
            console.log("shop");
          }}
        >
          <Ionicons name="ios-cart" size={16} />
          <Text style={{ fontSize: 12 }}>{`${locale[appLocale]["SHOP"]}`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderPost = () => {
    const { data } = this.state;
    if (this.state.loading) {
      return this.renderLoading();
    } else {
      if (this.state.error) {
        return this.renderError();
      }
      return (
        <FlatList
          // ListHeaderComponent={this.renderHeader}
          // stickyHeaderIndices={[0]}
          style={{ marginTop: 0, width: "100%", backgroundColor: "#fff" }}
          contentContainerStyle={{
            backgroundColor: "#fff"
          }}
          data={normalizeData(data, numColumns)}
          renderItem={({ item }) => (
            <RecommendGridViewImage dataSource={item} numColumns={numColumns} />
          )}
          ListEmptyComponent={this.listEmpty}
          keyExtractor={item => item._id}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          numColumns={numColumns}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      );
    }
  };

  show = () => {
    const { animationDuration } = this.props;
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: animationDuration
      }),
      Animated.timing(this.state.zIndex, {
        toValue: 1,
        duration: 0
      })
    ]).start();
  };

  hide = () => {
    const { animationDuration } = this.props;
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: animationDuration
      }),
      Animated.timing(this.state.zIndex, {
        toValue: 0,
        duration: 0
      })
    ]).start();
  };

  render() {
    const { opacity, zIndex } = this.state;
    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: opacity, zIndex: zIndex, elevation: zIndex }
        ]}
      >
        {this.renderHeader()}
        {this.renderPost()}
      </Animated.View>
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
)(withNavigation(PostRecommend));

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "center",
    height: window.height - Header.HEIGHT - Constants.statusBarHeight,
    width: "100%",
    backgroundColor: "#fff"
  },
  sectionHeader: {
    height: window.height * 0.08,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  section: {
    borderRadius: 10,
    height: "90%",
    width: "30%",
    borderWidth: 2,
    borderColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center"
  },
  listFooter: {
    alignItems: "center",
    justifyContent: "center",
    height: 2 * Header.HEIGHT
  },
  errorMsgView: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
});
