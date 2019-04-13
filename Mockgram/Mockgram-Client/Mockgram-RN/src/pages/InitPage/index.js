import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import window from "../../utils/getDeviceInfo";

class InitPageIndex extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    setTimeout(() => {
      navigation.goBack();
    }, 4000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 150, height: 150, borderRadius: 75 }}
          source={require("../../static/favicon.png")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  }
});

export default withNavigation(InitPageIndex);
