import React from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";

import Button from "../../components/Button";

class CreateLocation extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(CreateLocation);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff"
  }
});
