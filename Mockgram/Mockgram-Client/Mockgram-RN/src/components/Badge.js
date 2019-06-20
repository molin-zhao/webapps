import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class Badge extends React.Component {
  renderBadge = () => {
    const { val, style } = this.props;
    if (val > 0) {
      return (
        <View style={[styles.badgeBackground, style]}>
          <View style={styles.badge}>
            <Text style={{ color: "#fff", fontSize: 6, fontWeight: "bold" }}>
              {val}
            </Text>
          </View>
        </View>
      );
    }
    return null;
  };

  render() {
    return <this.renderBadge />;
  }
}

const styles = StyleSheet.create({
  badgeBackground: {
    zIndex: 1,
    position: "absolute",
    right: -8,
    top: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  badge: {
    zIndex: 2,
    width: "85%",
    height: "85%",
    backgroundColor: "red",
    borderRadius: 8,
    justifyContent: "space-around",
    alignItems: "center"
  }
});
