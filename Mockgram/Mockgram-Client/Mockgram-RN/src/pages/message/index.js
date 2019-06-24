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
import { locale } from "../../common/locale";

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
    const { appLocale } = this.props;
    return (
      <ScrollableTabView
        style={{
          marginTop: Constants.statusBarHeight,
          backgroundColor: "#fff",
          height: window.height - Constants.statusBarHeight,
          width: window.width
        }}
        renderTabBar={() => (
          <CustomTabBar
            tabNames={[
              `${locale[appLocale]["FOLLOWING"]}`,
              `${locale[appLocale]["YOU"]}`
            ]}
          />
        )}
        tabBarPosition="top"
        initialPage={1}
      >
        <FollowingPage tabLabel={`${locale[appLocale]["FOLLOWING"]}`} />
        <YouPage tabLabel={`${locale[appLocale]["YOU"]}`} />
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  message: state.message.message,
  appLocale: state.app.appLocale
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
