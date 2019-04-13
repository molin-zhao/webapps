import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";

import Badge from "../components/Badge";
import { messageCountNormalizer } from "../utils/unitConverter";
import { getNewMessageCount } from "../utils/arrayEditor";
import { updateLastMessageId } from "../redux/actions/messageActions";

class MessageBadgeIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      color,
      size,
      name,
      client,
      message,
      lastMessageId,
      updateLastMessageId
    } = this.props;
    let badgeCount = messageCountNormalizer(
      getNewMessageCount(message, lastMessageId)
    );
    return (
      <View style={styles.container}>
        <Badge val={badgeCount} />
        <Icon
          name={name}
          color={color}
          size={size}
          onPress={() => {
            if (client) {
              updateLastMessageId();
            }
          }}
        />
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

const mapDispatchToProps = dispatch => {
  return {
    updateLastMessageId: () => dispatch(updateLastMessageId())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(MessageBadgeIcon));

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  }
});
