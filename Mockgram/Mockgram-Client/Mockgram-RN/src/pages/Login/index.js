import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { createStackNavigator } from "react-navigation";
import LoginPage from "./Login";
import RegisterPage from "./Register";

export default (LoginIndex = createStackNavigator({
  Login: {
    screen: LoginPage,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => {
            navigation.dismiss();
          }}
        >
          <Icon name="times" size={24} />
        </TouchableOpacity>
      )
    })
  },
  Register: {
    screen: RegisterPage,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => {
            navigation.dismiss();
          }}
        >
          <Icon name="times" size={24} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="chevron-left" size={20} />
        </TouchableOpacity>
      )
    })
  }
}));
