import React from "react";
import { StyleSheet } from "react-native";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { Constants } from "expo";
import { Header } from "react-navigation";
import { connect } from "react-redux";

import Camera from "./Camera";
import Library from "./Library";

import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";

class PostIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = () => {
    return {
      header: null
    };
  };

  render() {
    return (
      <ScrollableTabView
        style={styles.container}
        renderTabBar={() => <DefaultTabBar />}
        tabBarPosition="top"
        tabBarUnderlineStyle={styles.lineStyle}
        tabBarActiveTextColor={theme.primaryColor}
        tabBarBackgroundColor="white"
        tabBarInactiveTextColor="black"
        initialPage={0}
      >
        <Library navigation={this.props.navigation} tabLabel="Library" />
        <Camera navigation={this.props.navigation} tabLabel="Camera" />
      </ScrollableTabView>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(PostIndex);

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height - Header.HEIGHT - Constants.statusBarHeight,
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#fff"
  },

  lineStyle: {
    backgroundColor: theme.primaryColor,
    width: window.width / 4,
    left: window.width / 8
  }
});
