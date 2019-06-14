import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { FontAwesome } from "@expo/vector-icons";

export default class FontAwesomeTabBar extends React.Component {
  renderTabOption(tab, i) {
    let color =
      this.props.activeTab == i
        ? this.props.activeColor
        : this.props.inactiveColor;
    return (
      <TouchableOpacity
        onPress={() => this.props.goToPage(i)}
        style={styles.tab}
        key={tab}
      >
        <View style={styles.tabItem}>
          <FontAwesome
            name={this.props.tabFontAwesomeNames[i]}
            size={24}
            color={color}
          />
          <Text style={{ color: color }}>{this.props.tabNames[i]}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.tabs}>
        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  }
}

FontAwesomeTabBar.propTypes = {
  goToPage: PropTypes.func, // func invoked when jump to other tabs
  activeTab: PropTypes.number, // current index of selected tabs
  tabs: PropTypes.array, // all tabs array

  tabNames: PropTypes.array, // tab names
  tabFontAwesomeNames: PropTypes.array, // tab icons
  activeColor: PropTypes.string, // active color
  inactiveColor: PropTypes.string // inactive color
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    height: 50,
    borderColor: "lightgrey",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5
  },

  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  tabItem: {
    flexDirection: "column",
    alignItems: "center"
  }
});
