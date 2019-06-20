import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

import PolygonCreator from "../../components/PolygonCreator";

class CreateLocation extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      title: navigation.getParam("createLocationTitle"),
      headerTitleStyle: {
        fontSize: 14
      },
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.popToTop();
          }}
        >
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    const { i18n, navigation } = this.props;
    navigation.setParams({
      createLocationTitle: `${i18n.t("CREATE_TITLE", {
        value: `${i18n.t("LOCATION")}`
      })}`
    });
  }

  render() {
    const { navigation, client } = this.props;
    let coordinates = navigation.getParam("currentCoordinates");
    return (
      <View style={styles.container}>
        <PolygonCreator coordinates={coordinates} client={client} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client,
  i18n: state.app.i18n
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
