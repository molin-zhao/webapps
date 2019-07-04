import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { SkypeIndicator } from "react-native-indicators";

import config from "../../common/config";
import baseUrl from "../../common/baseUrl";
import { parseIdFromObjectArray } from "../../utils/idParser";
import FollowingMessageListCell from "../../components/FollowingMessageUserListCell";
import { Header, withNavigation } from "react-navigation";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";
import theme from "../../common/theme";

class Following extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      refreshing: false,
      loading: false,
      loadingMore: false,
      hasMore: true,
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
        await this.fetchFollowingList();
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

  fetchFollowingList = () => {
    const { client } = this.props;
    return fetch(`${baseUrl.api}/message/following`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: client.token
      },
      body: JSON.stringify({
        limit: config.USER_RETURN_LIMIT,
        lastQueryDataIds: this.state.loadingMore
          ? parseIdFromObjectArray(this.state.data)
          : []
      })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: this.state.loadingMore
            ? this.state.data.concat(res.data)
            : res.data,
          hasMore: res.data.length < config.USER_RETURN_LIMIT ? false : true,
          error: res.status === 200 ? null : res.msg,
          loading: false,
          loadingMore: false,
          refreshing: false
        });
      })
      .catch(err => {
        this.setState(
          {
            error: err,
            loading: false,
            loadingMore: false,
            refreshing: false
          },
          () => {
            console.log(err);
          }
        );
      });
  };

  handleRefresh = () => {
    if (!this.state.loading && !this.state.refreshing) {
      this.setState(
        {
          refreshing: true
        },
        async () => {
          await this.fetchFollowingList();
          if (this.mounted) {
            this.setState({
              refreshing: false
            });
          }
        }
      );
    }
  };

  handleLoadMore = () => {
    if (
      !this.state.loading &&
      !this.state.refreshing &&
      !this.state.loadingMore &&
      this.state.hasMore
    ) {
      this.setState(
        {
          loadingMore: true
        },
        async () => {
          await this.fetchFollowingList();
          if (this.mounted) {
            this.setState({
              loadingMore: false
            });
          }
        }
      );
    }
  };

  renderEmpty = () => {
    const { appLocale } = this.props;
    const { loading, refreshing } = this.state;
    if (loading || refreshing) return null;
    if (this.state.error) {
      return (
        <View style={styles.messageContainer}>
          <Text>{this.state.error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.messageContainer}>
        <Text>{`- ${locale[appLocale]["NO_FOLLOWING_MESSAGES"]} -`}</Text>
      </View>
    );
  };

  renderFooter = () => {
    const { hasMore, loading, refreshing, loadingMore } = this.state;
    const { appLocale } = this.props;
    if (loading || refreshing) return null;
    if (hasMore && loadingMore) {
      return (
        <View style={styles.listFooter}>
          <SkypeIndicator size={25} />
        </View>
      );
    }
    return (
      <View style={styles.listFooter}>
        <Text style={{ color: "grey", fontSize: 12 }}>
          {`- ${locale[appLocale]["NO_MORE_FOLLOWING_MESSAGES"]} -`}
        </Text>
      </View>
    );
  };

  renderContent = () => {
    const { loading } = this.state;
    if (loading) {
      return <SkypeIndicator size={theme.indicatorLg} />;
    }
    return (
      <FlatList
        style={{
          backgroundColor: "#fff",
          width: "100%",
          marginTop: 0,
          flex: 1
        }}
        contentContainerStyle={{ flex: 1 }}
        data={this.state.data}
        renderItem={({ item }) => {
          return <FollowingMessageListCell dataSource={item} />;
        }}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        ListFooterComponent={this.renderFooter}
        ListEmptyComponent={this.renderEmpty}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.1}
        keyExtractor={item => item._id}
      />
    );
  };

  render() {
    return <View style={styles.container}>{this.renderContent()}</View>;
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(withNavigation(Following));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  messageContainer: {
    backgroundColor: "#fff",
    height: window.height - 2 * Header.HEIGHT,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  listFooter: {
    alignItems: "center",
    justifyContent: "center",
    height: window.height * 0.1
  }
});
