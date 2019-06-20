import React from "react";
import { StyleSheet } from "react-native";
import ScrollableTabView from "react-native-scrollable-tab-view";
import { connect } from "react-redux";
import { Constants } from "expo";
import { Header } from "react-navigation";

import FollowingPage from "./Following";
import YouPage from "./You";
import CustomTabBar from "../../components/CustomTabBar";

import window from "../../utils/getDeviceInfo";

class MessageIndex extends React.Component {
  static navigationOptions = () => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { client, navigation } = this.props;
    if (!client) {
      navigation.navigate("Auth");
    }
  }

  render() {
    return (
      <ScrollableTabView
        style={{
          backgroundColor: "#fff",
          marginTop: Constants.statusBarHeight,
          height: window.height - Header.HEIGHT - Constants.statusBarHeight,
          width: window.width
        }}
        renderTabBar={() => <CustomTabBar tabNames={["Following", "You"]} />}
        tabBarPosition="top"
        initialPage={1}
      >
        <FollowingPage tabLabel="Following" />
        <YouPage tabLabel="You" />
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  message: state.message.message
});

export default connect(
  mapStateToProps,
  null
)(MessageIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
