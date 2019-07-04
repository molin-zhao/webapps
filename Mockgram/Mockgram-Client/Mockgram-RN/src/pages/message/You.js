import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";

import MessageListCell from "../../components/MessageListCell";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";

class You extends React.Component {
  renderMessage = () => {
    const { message, appLocale } = this.props;
    if (message && message.length > 0) {
      return (
        <FlatList
          data={message}
          renderItem={({ item }) => <MessageListCell dataSource={item} />}
          keyExtractor={item => item._id}
        />
      );
    }
    return (
      <View
        style={{
          height: window.height * 0.5,
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>{`${locale[appLocale]["NO_NEW_MESSAGES"]}`}</Text>
      </View>
    );
  };
  render() {
    return <View style={styles.container}>{this.renderMessage()}</View>;
  }
}

const mapStateToProps = state => ({
  message: state.message.message,
  appLocale: state.app.appLocale
});
export default connect(
  mapStateToProps,
  null
)(You);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
