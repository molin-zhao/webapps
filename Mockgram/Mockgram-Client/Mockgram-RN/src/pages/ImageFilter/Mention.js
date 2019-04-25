import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class Mention extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mentionedUsers: this.props.navigation.getParam("mentionedUsers", {})
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0
    },
    title: "Mention Users",
    headerTitleStyle: {
      fontSize: 14
    },
    headerLeft: (
      <TouchableOpacity
        style={{ marginLeft: 20 }}
        onPress={() => {
          let passMentionedUsersBack = navigation.getParam(
            "passMentionedUsersBack"
          );
          let getMentionedUsers = navigation.getParam("getMentionedUsers");
          passMentionedUsersBack(getMentionedUsers());
          navigation.popToTop();
        }}
      >
        <Icon name="chevron-left" size={20} />
      </TouchableOpacity>
    )
  });

  componentDidMount() {
    this.props.navigation.setParams({
      getMentionedUsers: () => this.state.mentionedUsers
    });
  }

  render() {
    return <View />;
  }
}

export default Mention;
