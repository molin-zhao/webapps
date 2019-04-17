import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import SearchBarView from "../../components/SearchBarView";

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      searchValue: "",
      typing: false,
      searchBarInput: "",
      timer: null,
      focused: false
    };
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
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

export default Tag;
