import React from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation";
import LoginPage from "./Login";
import RegisterPage from "./Register";

export default (LoginIndex = createStackNavigator({
  Login: {
    screen: LoginPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerStyle: {
          borderBottomColor: "transparent",
          borderBottomWidth: 0,
          shadowColor: "transparent",
          elevation: 0
        },
        title: "Login",
        headerTitleStyle: {
          fontSize: 14
        },
        headerRight: (
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.dismiss();
            }}
          >
            <FontAwesome name="times" size={24} />
          </TouchableOpacity>
        )
      };
    }
  },
  Register: {
    screen: RegisterPage,
    navigationOptions: ({ navigation }) => {
      return {
        headerStyle: {
          borderBottomColor: "transparent",
          borderBottomWidth: 0,
          shadowColor: "transparent",
          elevation: 0
        },
        title: "Register",
        headerTitleStyle: {
          fontSize: 14
        },
        headerRight: (
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.dismiss();
            }}
          >
            <FontAwesome name="times" size={24} />
          </TouchableOpacity>
        ),
        headerLeft: (
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FontAwesome name="chevron-left" size={20} />
          </TouchableOpacity>
        )
      };
    }
  }
}));
