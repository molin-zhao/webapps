import React from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { SkypeIndicator, BallIndicator } from "react-native-indicators";
import { connect } from "react-redux";

import CommentListCell from "../../components/CommentListCell";
import TextInputBox from "../../components/TextInputBox";
import Header from "../../components/Header";

import config from "../../common/config";
import baseUrl from "../../common/baseUrl";
import { parseIdFromObjectArray } from "../../utils/idParser";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";
import theme from "../../common/theme";

class CommentPage extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      postId: this.props.navigation.getParam("postId", null),
      creatorId: this.props.navigation.getParam("creatorId", null),
      loading: false,
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
      async () => {
        await this.fetchComment();
        if (this.mounted) {
          this.setState({
            loading: false
          });
        }
      }
    );
  }

  componentWillUpdate(nextProps) {
    const { client } = this.props;
    if (client != nextProps.client) {
      this.handleReload();
    }
  }

  fetchComment = () => {
    const { client } = this.props;
    const url = `${baseUrl.api}/post/comment`;
    this.setState(
      {
        fetching: true
      },
      () => {
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            lastQueryDataIds: this.state.loadingMore
              ? parseIdFromObjectArray(this.state.data)
              : [],
            postId: this.state.postId,
            creatorId: this.state.creatorId,
            limit: config.COMMENT_RETURN_LIMIT,
            userId: client && client.user ? client.user._id : null
          })
        })
          .then(res => res.json())
          .then(res => {
            if (this.mounted) {
              if (this.state.interrupt) {
                this.setState({
                  interrupt: false
                });
              } else {
                this.setState({
                  data:
                    this.state.loadingMore === true
                      ? [...this.state.data, ...res.data]
                      : res.data,
                  error: res.status === 200 ? null : res.msg,
                  hasMore:
                    res.data.length < config.COMMENT_RETURN_LIMIT ? false : true
                });
              }
            }
          })
          .then(() => {
            if (this.mounted) {
              this.setState({
                fetching: false
              });
            }
          })
          .catch(error => {
            if (this.mounted) {
              this.setState({
                error: error,
                fetching: false,
                loading: false,
                loadingMore: false,
                interrupt: false
              });
            }
          });
      }
    );
  };

  handleReload = () => {
    if (this.state.fetching) {
      this.setState({
        interrupt: true
      });
    }
    this.setState(
      {
        loading: true,
        loadingMore: false
      },
      async () => {
        await this.fetchComment();
        if (this.mounted) {
          this.setState({
            loading: false
          });
        }
      }
    );
  };

  handleLoadMore = () => {
    if (this.state.hasMore && !this.state.loadingMore && !this.state.loading) {
      this.setState(
        {
          loadingMore: true
        },
        async () => {
          await this.fetchComment();
          if (this.mounted) {
            this.setState({
              loadingMore: false
            });
          }
        }
      );
    }
  };

  renderFooter = () => {
    const { data, hasMore } = this.state;
    const { appLocale } = this.props;
    if (data.length !== 0) {
      return (
        <View style={styles.listFooter}>
          {hasMore ? (
            <BallIndicator size={20} />
          ) : (
            <Text style={{ color: "grey", fontSize: 12 }}>
              {`${locale[appLocale]["NO_MORE_COMMENTS"]}`}
            </Text>
          )}
        </View>
      );
    }
    return null;
  };

  renderEmpty = () => {
    const { appLocale } = this.props;
    return (
      <View style={styles.errorMsgView}>
        <Ionicons name="md-paper" size={window.height * 0.05} />
        <Text>{`- ${locale[appLocale]["BECOME_FIRST_TO_LEAVE"](
          locale[appLocale]["COMMENT"]
        )} -`}</Text>
      </View>
    );
  };

  renderComment = () => {
    const { loading, data, error } = this.state;
    const { appLocale } = this.props;
    if (loading) {
      return (
        <View style={styles.errorMsgView}>
          <SkypeIndicator />
        </View>
      );
    } else {
      if (error) {
        return (
          <View style={styles.errorMsgView}>
            <Text>
              {error.sourceURL
                ? `${locale[appLocale]["NETWORK_REQUEST_ERROR"]}`
                : error}
            </Text>
          </View>
        );
      }
      return (
        <FlatList
          style={{ marginTop: 0, width: "100%", flex: 1 }}
          data={data}
          renderItem={({ item }) => (
            <CommentListCell
              dataSource={item}
              creatorId={this.state.creatorId}
              textInputController={this._textInput}
            />
          )}
          keyExtractor={item => item._id}
          ListFooterComponent={this.renderFooter}
          ListEmptyComponent={this.renderEmpty}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.2}
        />
      );
    }
  };

  render() {
    const { navigation, appLocale } = this.props;
    const { postId } = this.state;
    return (
      <View style={styles.container}>
        <Header
          headerTitle={`${locale[appLocale]["COMMENTS"]}`}
          rightIconButton={() => (
            <Ionicons
              name="md-close"
              size={theme.iconMd}
              onPress={() => {
                navigation.dismiss();
              }}
            />
          )}
        />
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, width: "100%", flexDirection: "column" }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this._textInput.dismiss();
            }}
          >
            <View style={styles.contentContainer}>{this.renderComment()}</View>
          </TouchableWithoutFeedback>
          <TextInputBox
            onRef={o => (this._textInput = o)}
            defaultMessageReceiver={{
              _id: "",
              username: "",
              commentId: "",
              postId: postId,
              type: "comment",
              dataCallbackController: this
            }}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 0,
    width: "100%"
  },
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50
  },
  errorMsgView: {
    height: window.height * 0.85,
    width: window.width,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => ({
  client: state.client.client,
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(CommentPage);
