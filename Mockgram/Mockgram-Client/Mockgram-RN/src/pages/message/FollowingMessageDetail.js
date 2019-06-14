import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";

import DynamicContentList from "../../components/DynamicContentListView";
import FollowingMessageDetailListCell from "../../components/FollowingMessageDetailListCell";

import config from "../../common/config";
import baseUrl from "../../common/baseUrl";

class FollowingMessageDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("username", "username"),
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
    const { client, navigation } = this.props;
    if (!client) {
      navigation.navigate("Auth");
    }
  }

  render() {
    const { client, navigation } = this.props;
    return (
      <DynamicContentList
        request={{
          url: `${baseUrl.api}/message/following/detail`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: client.token
          },
          body: {
            limit: config.MESSAGE_RETURN_LIMIT,
            userId: navigation.getParam("userId", null)
          }
        }}
        renderItem={FollowingMessageDetailListCell}
        footerHasMore={<SkypeIndicator size={20} />}
        footerNoMore={
          <Text style={{ color: "grey", fontSize: 12 }}>
            - No more messages -
          </Text>
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(FollowingMessageDetail);
