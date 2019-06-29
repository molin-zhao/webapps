import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import ActionSheet from "react-native-actionsheet";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

import Button from "./Button";
import Thumbnail from "./Thumbnail";

import baseUrl from "../common/baseUrl";
import window from "../utils/getDeviceInfo";
import theme from "../common/theme";
import { locale } from "../common/locale";

class UserListCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataSource: this.props.dataSource
    };
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  followAction = type => {
    const { client, navigation } = this.props;
    const { dataSource } = this.state;
    if (client && client.token) {
      this.setState(
        {
          loading: true
        },
        () => {
          return fetch(`${baseUrl.api}/user/follow`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: client.token
            },
            body: JSON.stringify({
              followingId: dataSource._id,
              type: type
            })
          })
            .then(res => res.json())
            .then(resJson => {
              this.setState(
                {
                  loading: false
                },
                () => {
                  if (resJson.status === 200) {
                    dataSource.followed = !dataSource.followed;
                    this.setState({
                      dataSource: dataSource
                    });
                  }
                }
              );
            })
            .catch(err => {
              this.setState({
                loading: false
              });
              console.log(err);
            });
        }
      );
    } else {
      navigation.navigate("Auth");
    }
  };

  renderButton = () => {
    const { client, appLocale } = this.props;
    const { dataSource } = this.state;
    if (client && client.user._id === dataSource._id) {
      return null;
    }
    let followStyle = {
      backgroundColor: theme.primaryColor,
      width: 90,
      height: 40
    };
    let followingStyle = {
      backgroundColor: "lightgrey",
      borderColor: "black",
      width: 90,
      height: 40
    };
    return (
      <Button
        containerStyle={dataSource.followed ? followingStyle : followStyle}
        loading={this.state.loading}
        titleStyle={{ fontSize: 14, color: "#fff" }}
        iconRight={() => {
          if (dataSource.followed) {
            return <Ionicons name="md-checkmark" color="#fff" size={18} />;
          }
          return null;
        }}
        title={
          dataSource.followed
            ? `${locale[appLocale]["FOLLOWING"]}`
            : `${locale[appLocale]["FOLLOW"]}`
        }
        onPress={() => {
          dataSource.followed
            ? this.showActionSheet()
            : this.followAction("Follow");
        }}
      />
    );
  };

  render() {
    const { dataSource, client, navigation, appLocale } = this.props;
    return (
      <View
        style={{
          borderWidth: 0,
          width: window.width,
          height: 80,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start"
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (client && client.user._id === dataSource._id) {
              navigation.navigate("Profile");
            } else {
              navigation.push("UserProfile", {
                username: dataSource.username,
                avatar: dataSource.avatar,
                _id: dataSource._id
              });
            }
          }}
          style={{
            flex: 3,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Thumbnail
              source={dataSource.avatar}
              style={{ width: 40, height: 40 }}
            />
          </View>
          <View
            style={{
              width: "80%",
              justifyContent: "center",
              alignItems: "flex-start"
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {dataSource.username}
            </Text>
            <Text>{dataSource.nickname}</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderButton()}
        </View>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={locale[appLocale]["UNFOLLOW_TITLE"]}
          message={locale[appLocale]["UNFOLLOW_INFO"]}
          options={[
            `${locale[appLocale]["CONFIRM"]}`,
            `${locale[appLocale]["CANCEL"]}`
          ]}
          cancelButtonIndex={1}
          onPress={index => {
            if (index === 0) {
              //unfollow user
              this.followAction("Unfollow");
            }
          }}
        />
      </View>
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
)(withNavigation(UserListCell));
