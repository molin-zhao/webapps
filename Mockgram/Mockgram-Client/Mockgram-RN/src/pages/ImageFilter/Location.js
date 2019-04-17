import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class Location extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0
    },
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
  });

  render() {
    return <View />;
  }
}

export default Location;
