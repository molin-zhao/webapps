import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text
} from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";

import UserListCell from "../../components/UserListCell";
import baseURL from "../../common/baseUrl";
import config from "../../common/config";
import { parseIdFromObjectArray } from "../../utils/idParser";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";

class UserList extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userId: this.props.navigation.getParam("userId", null),
      type: this.props.navigation.getParam("type", "Follower"),
      loading: false,
      refreshing: false,
      loadingMore: false,
      hasMore: true,
      error: null
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("type", "Follower"),
    headerLeft: (
      <TouchableOpacity
        style={{ marginLeft: 20 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <FontAwesome name="chevron-left" size={20} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    this.mounted = true;
    const { userId, type } = this.state;
    let limit = config.USER_RETURN_LIMIT;
    this.setState(
      {
        loading: true
      },
      () => {
        this.fetchUsers(userId, type, limit);
      }
    );
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fetchUsers = (userId, type, limit) => {
    return fetch(`${baseURL.api}/profile/user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit: limit,
        userId: userId,
        lastQueryDataIds: this.state.loadingMore
          ? parseIdFromObjectArray(this.state.data)
          : [],
        type: type
      })
    })
      .then(res => res.json())
      .then(res => {
        if (this.mounted) {
          if (res.status === 200) {
            this.setState({
              data: this.state.loadingMore
                ? this.state.data.concat(res.data)
                : res.data,
              hasMore: res.data.length < limit ? false : true
            });
          } else {
            this.setState({
              error: res.msg
            });
          }
        }
      })
      .then(() => {
        if (this.mounted) {
          this.setState({
            loading: false,
            refreshing: false,
            loadingMore: false
          });
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

  listEmpty = () => {
    const { appLocale } = this.props;
    const { type } = this.state;
    return (
      <View style={styles.listEmpty}>
        <Text style={{ fontSize: 12, marginTop: 20 }}>{`- ${locale[appLocale][
          "NO_MORE_VALUE"
        ](
          type === "Follower"
            ? locale[appLocale]["FOLLOWER"]
            : locale[appLocale]["FOLLOWING"]
        )} -`}</Text>
      </View>
    );
  };

  handleRefresh = () => {
    if (!this.state.loading && !this.state.refreshing) {
      const { userId, type } = this.state;
      let limit = config.USER_RETURN_LIMIT;
      this.setState(
        {
          refreshing: true
        },
        () => {
          this.fetchUsers(userId, type, limit);
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
      const { userId, type } = this.state;
      let limit = config.USER_RETURN_LIMIT;
      this.setState(
        {
          loadingMore: true
        },
        () => {
          this.fetchUsers(userId, type, limit);
        }
      );
    }
  };

  renderFooter = () => {
    const {
      loading,
      loadingMore,
      refreshing,
      data,
      hasMore,
      type
    } = this.state;
    const { appLocale } = this.props;
    if (!loading && !loadingMore && !refreshing && data.length === 0) {
      return null;
    }
    return (
      <View
        style={{
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          height: window.height * 0.1,
          width: "100%"
        }}
      >
        {hasMore ? (
          <SkypeIndicator size={25} />
        ) : (
          <Text style={{ color: "grey", fontSize: 12 }}>{`- ${locale[appLocale][
            "NO_MORE_VALUE"
          ](
            type === "Follower"
              ? locale[appLocale]["FOLLOWER"]
              : locale[appLocale]["FOLLOWING"]
          )} -`}</Text>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.data}
          style={{ marginTop: 0, width: "100%", backgroundColor: "#fff" }}
          contentContainerStyle={{ backgroundColor: "#fff" }}
          renderItem={({ item }) => <UserListCell dataSource={item} />}
          ListEmptyComponent={this.listEmpty}
          keyExtractor={item => item._id}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0.2}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(UserList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  listEmpty: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center"
  }
});
