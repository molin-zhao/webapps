import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  View,
  TouchableWithoutFeedback
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { SkypeIndicator } from "react-native-indicators";
import { Ionicons } from "@expo/vector-icons";

import theme from "../common/theme";
import window from "../utils/getDeviceInfo";
import { locale } from "../common/locale";

class ModalDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      activeIndex: props.defaultIndex,
      dropdownHeight: new Animated.Value(0),
      dropdownOpacity: new Animated.Value(0)
    };
  }

  static defaultProps = {
    options: [],
    defaultIndex: -1,
    activeOpacity: 0.8,
    defaultTextStyle: { fontSize: 10, color: "lightgrey", fontWeight: "bold" },
    defaultButtonStyle: {
      width: window.width * 0.15,
      height: window.width * 0.05
    },
    optionContainerStyle: {
      borderBottomColor: "grey",
      borderBottomWidth: 1
    },
    dropdownContainerStyle: {
      width: window.width * 0.25,
      height: window.height * 0.1
    },
    renderOptionRow: (option, index) => (
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        key={index}
        style={{
          fontSize: 10,
          color: "lightgrey",
          fontWeight: "bold"
        }}
      >
        {option}
      </Text>
    ),
    animateDuration: 200,
    showDropdownDirection: "bottom",
    onSelect: (option, index) => {
      console.log(option, index);
    }
  };

  static propTypes = {
    options: PropTypes.array,
    defaultIndex: PropTypes.number,
    defaultTextStyle: PropTypes.object,
    defaultButtonStyle: PropTypes.object,
    dropdownContainerStyle: PropTypes.object,
    optionContainerStyle: PropTypes.object,
    animateDuration: PropTypes.number,
    activeOpacity: PropTypes.number,
    showDropdownDirection: PropTypes.string,
    renderOptionsRow: PropTypes.func,
    onSelect: PropTypes.func
  };

  _renderIndicator = () => {
    const { showOptions } = this.state;
    const { defaultTextStyle } = this.props;
    return (
      <View
        style={{
          marginLeft: 2,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2,
          width: theme.iconSm,
          height: theme.iconSm
        }}
      >
        <Ionicons
          name={showOptions ? "md-arrow-dropup" : "md-arrow-dropdown"}
          color={defaultTextStyle.color}
        />
      </View>
    );
  };

  renderButtonText = position => {
    const {
      defaultIndex,
      options,
      defaultTextStyle,
      appLocale,
      showDropdownDirection,
      activeOpacity,
      defaultButtonStyle
    } = this.props;
    const { activeIndex } = this.state;
    if (position !== showDropdownDirection) return null;
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={() => {
          if (this.state.showOptions) return this.hide();
          return this.show();
        }}
        style={[
          {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          },
          defaultButtonStyle
        ]}
      >
        <Text numberOfLines={1} ellipsizeMode="tail" style={defaultTextStyle}>
          {defaultIndex === -1 || !options[defaultIndex]
            ? `${locale[appLocale]["PLEASE_SELCET"]}`
            : options[activeIndex]}
        </Text>
        {this._renderIndicator()}
      </TouchableOpacity>
    );
  };

  position = () => {
    const { showDropdownDirection, defaultButtonStyle } = this.props;
    if (showDropdownDirection === "bottom")
      return { top: defaultButtonStyle.height };
    return { bottom: defaultButtonStyle.height };
  };

  render() {
    const {
      renderOptionRow,
      dropdownContainerStyle,
      options,
      onSelect,
      optionContainerStyle
    } = this.props;
    return (
      <View>
        {this.renderButtonText("bottom")}
        <Animated.View
          style={[
            dropdownContainerStyle,
            {
              position: "absolute",
              zIndex: 1,
              elevation: 1,
              height: this.state.dropdownHeight,
              opacity: this.state.dropdownOpacity
            },
            this.position()
          ]}
        >
          {options.length === 0 ? (
            <SkypeIndicator size={theme.iconSm} color="lightgrey" />
          ) : (
            options.map((option, index) => (
              <TouchableWithoutFeedback
                style={optionContainerStyle}
                onPress={async () => {
                  this.hide();
                  await onSelect(option, index);
                  this.setState({
                    activeIndex: index
                  });
                }}
                key={index}
              >
                {renderOptionRow(option, index)}
              </TouchableWithoutFeedback>
            ))
          )}
        </Animated.View>
        {this.renderButtonText("top")}
      </View>
    );
  }

  show = () => {
    const {
      dropdownContainerStyle,
      animateDuration,
      showDropdownDirection
    } = this.props;
    if (!this.state.showOptions) {
      this.setState({
        showOptions: true
      });
      Animated.parallel([
        Animated.timing(this.state.dropdownHeight, {
          toValue:
            showDropdownDirection === "top"
              ? dropdownContainerStyle.height
              : -dropdownContainerStyle.height,
          duration: animateDuration
        }),
        Animated.timing(this.state.dropdownOpacity, {
          toValue: 1,
          duration: animateDuration
        })
      ]).start();
    }
  };

  hide = () => {
    const { animateDuration } = this.props;
    if (this.state.showOptions) {
      this.setState({
        showOptions: false
      });
      Animated.parallel([
        Animated.timing(this.state.dropdownHeight, {
          toValue: 0,
          duration: animateDuration
        }),
        Animated.timing(this.state.dropdownOpacity, {
          toValue: 0,
          duration: animateDuration
        })
      ]).start();
    }
  };
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(ModalDropdown);

const styles = StyleSheet.create({
  container: {
    width: window.width * 0.15,
    height: window.width * 0.1
  }
});
