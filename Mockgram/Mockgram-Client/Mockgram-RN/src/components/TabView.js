import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import window from "../utils/getDeviceInfo";
import theme from "../common/theme";

export default class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, // by default the first tab
      activeColor: this.props.activeColor,
      inactiveColor: this.props.inactiveColor
    };
  }

  componentDidMount() {
    this.renderTabView();
  }

  renderTabView = () => {
    let refKeys = Object.keys(this.refs);
    refKeys.map((key, index) => {
      let instance = this.refs[key].wrappedInstance;
      if (index === this.state.activeIndex) {
        instance.show();
      } else {
        instance.hide();
      }
    });
  };

  tabSelected = index => {
    this.setState(
      {
        activeIndex: index
      },
      () => {
        this.renderTabView();
      }
    );
  };

  activeStyle = index => {
    return this.state.activeIndex === index
      ? this.state.activeColor
      : this.state.inactiveColor;
  };

  renderTabBar = () => {
    const { tabBarComponents } = this.props;
    return tabBarComponents.map((tabComponent, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={styles.tabCell}
          onPress={() => this.tabSelected(index)}
        >
          {tabComponent.icon ? (
            <Icon
              name={tabComponent.icon.name}
              style={[
                { fontSize: 24, color: this.activeStyle(index) },
                tabComponent.icon.style
              ]}
              name={tabComponent.icon.name}
              size={theme.btnMd}
            />
          ) : null}
          {tabComponent.text ? (
            <Text
              style={[
                { fontSize: 10, color: this.activeStyle(index) },
                tabComponent.text.style
              ]}
            >
              {tabComponent.text.title}
            </Text>
          ) : null}
        </TouchableOpacity>
      );
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tab}>{this.renderTabBar()}</View>
        <View style={{ width: "100%", alignItems: "center" }}>
          {this.props.children.map((child, index) => {
            return React.cloneElement(child, {
              onRef: index,
              ref: index,
              key: index
            });
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  tab: {
    height: window.height * 0.08,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eae5e5",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eae5e5"
  },
  tabCell: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    flex: 1
  }
});
