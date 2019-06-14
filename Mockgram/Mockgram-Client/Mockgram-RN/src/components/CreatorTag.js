import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default (renderTag = props => {
  const commentByPostCreator = props.byCreator;
  if (commentByPostCreator) {
    return (
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons name="md-ribbon" style={{ fontSize: 12, color: "#fff" }} />
        </View>
        <Text style={{ fontSize: 9, color: "#fff" }}>creator</Text>
      </View>
    );
  }
  return null;
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
    height: 16,
    width: 48,
    borderRadius: 8,
    backgroundColor: "#eb765a"
  },

  iconWrapper: {
    height: 10,
    width: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
