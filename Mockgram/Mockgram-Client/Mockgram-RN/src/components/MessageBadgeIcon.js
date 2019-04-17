import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";

import Badge from "../components/Badge";
import { messageCountNormalizer } from "../utils/unitConverter";
import { getNewMessageCount } from "../utils/arrayEditor";

class MessageBadgeIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { color, size, name, message, lastMessageId } = this.props;
    let badgeCount = messageCountNormalizer(
      getNewMessageCount(message, lastMessageId)
    );
    return (
      <View style={styles.container}>
        <Badge val={badgeCount} />
        <Icon name={name} color={color} size={size} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    client: state.client.client,
    message: state.message.message,
    lastMessageId: state.message.lastMessageId
  };
};

export default connect(
  mapStateToProps,
  null
)(MessageBadgeIcon);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
});
