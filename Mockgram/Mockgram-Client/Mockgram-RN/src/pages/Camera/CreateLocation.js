import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import PolygonCreator from "../../components/PolygonCreator";
import { locale } from "../../common/locale";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../../common/theme";

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
          <Ionicons name="ios-arrow-back" size={theme.iconMd} />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    const { appLocale, navigation } = this.props;
    navigation.setParams({
      createLocationTitle: `${locale[appLocale]["CREATE_TITLE"](
        locale[appLocale]["LOCATION"]
      )}`
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
  appLocale: state.app.appLocale
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
