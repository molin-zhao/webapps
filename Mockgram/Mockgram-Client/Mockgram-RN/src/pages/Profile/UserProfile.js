import React from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import ProfilePage from "../../components/ProfilePage";

export default class UserProfile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      title: navigation.getParam("username"),
      headerTitleStyle: {
        fontSize: 14
      },
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: theme.headerIconMargin }}
          onPress={() => {
            navigation.dismiss();
          }}
        >
          <FontAwesome name="ellipsis-h" size={theme.iconSm} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: theme.headerIconMargin }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={theme.iconSm} />
        </TouchableOpacity>
      )
    };
  };

  render() {
    const { navigation } = this.props;
    return (
      <ProfilePage
        id={navigation.getParam("_id")}
        username={navigation.getParam("username")}
      />
    );
  }
}
