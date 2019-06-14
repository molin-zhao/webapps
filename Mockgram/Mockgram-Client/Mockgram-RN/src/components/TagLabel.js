import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

import Proptypes from "prop-types";
import { stringTrimmer } from "../utils/unitConverter";
import theme from "../common/theme";

class TagLabel extends React.Component {
  static defaultProps = {
    button: () => null,
    dataSource: {
      name: "label"
    },
    defaultContainerStyle: {
      backgroundColor: "lightgrey"
    },
    selectedContainerStyle: {
      backgroundColor: theme.primaryGrey
    },
    defaultLabelStyle: {
      color: "black"
    },
    selectedLabelStyle: {
      color: "grey"
    },
    selected: false
  };
  static propTypes = {
    button: Proptypes.func,
    onPress: Proptypes.func,
    dataSource: Proptypes.object,
    selected: Proptypes.bool,

    // style properties
    defaultContainerStyle: Proptypes.object,
    selectedContainerStyle: Proptypes.object,
    defaultLabelStyle: Proptypes.object,
    selectedLabelStyle: Proptypes.object
  };

  renderButton = () => {
    const { button } = this.props;
    if (button()) {
      return <View style={styles.button}>{button()}</View>;
    } else {
      return null;
    }
  };

  renderSelectedStyle = style => {
    const { selected } = this.props;
    if (selected) {
      return style;
    }
    return null;
  };

  render() {
    const {
      onPress,
      dataSource,
      defaultContainerStyle,
      selectedContainerStyle,
      defaultLabelStyle,
      selectedLabelStyle
    } = this.props;
    return (
      <View style={styles.border}>
        <View
          style={[
            styles.container,
            defaultContainerStyle,
            this.renderSelectedStyle(selectedContainerStyle)
          ]}
        >
          <View style={{ width: 15 }} />
          <TouchableOpacity
            onPress={onPress}
            style={styles.labelContainer}
            activeOpacity={0.9}
          >
            <Text
              style={[
                { fontSize: 12 },
                defaultLabelStyle,
                this.renderSelectedStyle(selectedLabelStyle)
              ]}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {stringTrimmer(dataSource.name)}
            </Text>
          </TouchableOpacity>
          {this.renderButton()}
          <View style={{ width: 15 }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  border: {
    justifyContent: "center",
    alignItems: "center",
    height: 40
  },
  container: {
    marginLeft: 5,
    marginRight: 5,
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 15
  },
  labelContainer: {
    height: "90%",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default TagLabel;
