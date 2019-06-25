import React from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  Animated,
  TouchableOpacity,
  Text,
  TextInput,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import { UIActivityIndicator } from "react-native-indicators";
import { connect } from "react-redux";

import window from "../utils/getDeviceInfo";
import theme from "../common/theme";
import { locale } from "../common/locale";

class SearchBarView extends React.Component {
  static defaultProps = {
    containerStyle: { width: window.width, height: 50 },
    searchBarDefaultWidth: window.width,
    searchBarFocusedWidth: window.width * 0.8,
    duration: 100,
    onFocus: () => null,
    lostFocus: () => null,

    rightIonicons: () => null,
    searchingIndicator: () => (
      <UIActivityIndicator size={theme.iconSm} color="lightgrey" />
    ),

    showSearchingIndicator: false,
    searching: false
  };

  static propTypes = {
    containerStyle: PropTypes.object,
    duration: PropTypes.number,
    searchBarDefaultWidth: PropTypes.number,
    searchBarFocusedWidth: PropTypes.number,
    onFocus: PropTypes.func,
    lostFocus: PropTypes.func,

    rightIonicons: PropTypes.func,
    searchingIndicator: PropTypes.func,

    showSearchingIndicator: PropTypes.bool,
    searching: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      focused: false,

      // animatation properties
      searchBarWidth: new Animated.Value(this.props.searchBarDefaultWidth),
      buttonWidth: new Animated.Value(
        this.props.containerStyle.width - this.props.searchBarDefaultWidth
      )
    };
  }

  componentWillMount() {
    if (Platform.OS === "android") {
      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        this._keyboardDidHide
      );
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        this._keyboardDidShow
      );
    } else {
      this.keyboardWillShowListener = Keyboard.addListener(
        "keyboardWillShow",
        this._keyboardWillShow
      );
      this.keyboardWillHideListener = Keyboard.addListener(
        "keyboardWillHide",
        this._keyboardWillHide
      );
    }
  }

  componentWillUnmount() {
    if (Platform.OS === "android") {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    } else {
      this.keyboardWillShowListener.remove();
      this.keyboardWillHideListener.remove();
    }
  }

  _keyboardWillShow = () => {
    const { onFocus } = this.props;
    if (!this.state.text) {
      this.searchBarShrink();
    }
    this.setState(
      {
        focused: true
      },
      () => {
        onFocus();
      }
    );
  };

  _keyboardWillHide = () => {
    const { lostFocus } = this.props;
    if (!this.state.text) {
      this.searchBarExtend();
    }
    this.setState(
      {
        focused: false
      },
      () => {
        lostFocus();
      }
    );
  };

  _keyboardDidShow = () => {
    const { onFocus } = this.props;
    if (!this.state.text) {
      this.searchBarShrink();
    }
    this.setState(
      {
        focused: true
      },
      () => {
        onFocus();
      }
    );
  };

  _keyboardDidHide = () => {
    const { lostFocus } = this.props;
    if (!this.state.text) {
      this.searchBarExtend();
    }
    this.setState(
      {
        focused: false
      },
      () => {
        lostFocus();
      }
    );
  };

  searchBarShrink = () => {
    let containerWidth = this.props.containerStyle.width;
    let searchBarFocusedWidth = this.props.searchBarFocusedWidth;
    let buttonWidth = containerWidth - searchBarFocusedWidth;
    let animateDuration = this.props.duration;
    Animated.parallel([
      Animated.timing(this.state.searchBarWidth, {
        toValue: searchBarFocusedWidth,
        duration: animateDuration
      }),
      Animated.timing(this.state.buttonWidth, {
        toValue: buttonWidth,
        duration: animateDuration
      })
    ]).start();
  };

  searchBarExtend = () => {
    let containerWidth = this.props.containerStyle.width;
    let searchBarDefaultWidth = this.props.searchBarDefaultWidth;
    let buttonWidth = containerWidth - searchBarDefaultWidth;
    let animateDuration = this.props.duration;
    Animated.parallel([
      Animated.timing(this.state.searchBarWidth, {
        toValue: searchBarDefaultWidth,
        duration: animateDuration
      }),
      Animated.timing(this.state.buttonWidth, {
        toValue: buttonWidth,
        duration: animateDuration
      })
    ]).start();
  };

  onChangeText = text => {
    const { onChangeText } = this.props;
    this.setState(
      {
        text
      },
      () => {
        onChangeText(text);
      }
    );
  };

  clearInput = () => {
    this._textInput.clear();
    this.onChangeText("");
  };

  renderButton = () => {
    const { text, focused } = this.state;
    const { rightIonicons, appLocale } = this.props;
    if (focused || (!focused && text)) {
      return (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%"
          }}
          onPress={() => {
            this.setState(
              {
                text: ""
              },
              () => {
                this.clearInput();
                if (this._textInput.isFocused()) {
                  Keyboard.dismiss();
                } else {
                  this.searchBarExtend();
                }
              }
            );
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 14, color: theme.primaryBlue }}>{`${
            locale[appLocale]["CANCEL"]
          }`}</Text>
        </TouchableOpacity>
      );
    }
    return rightIonicons();
  };

  renderSearchingIndicator = () => {
    const {
      searchingIndicator,
      showSearchingIndicator,
      searching
    } = this.props;
    if (showSearchingIndicator) {
      return (
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {searching ? searchingIndicator() : null}
        </View>
      );
    }
    return null;
  };

  render() {
    const { containerStyle, appLocale } = this.props;
    return (
      <View style={[styles.searchBarViewContainer, containerStyle]}>
        <Animated.View
          style={[
            {
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            },
            { width: this.state.searchBarWidth }
          ]}
        >
          <View style={styles.searchBar}>
            <View
              style={{
                flex: 1,
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Ionicons name="ios-search" size={theme.iconSm} />
            </View>
            <TextInput
              ref={o => (this._textInput = o)}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ flex: 8 }}
              underlineColorAndroid="transparent"
              onChangeText={this.onChangeText}
              placeholder={`${locale[appLocale]["SEARCH"]}...`}
              value={this.state.text}
            />
            {this.renderSearchingIndicator()}
          </View>
        </Animated.View>
        <Animated.View
          style={[
            {
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            },
            { width: this.state.buttonWidth }
          ]}
        >
          {this.renderButton()}
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(SearchBarView);

const styles = StyleSheet.create({
  searchBarViewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 0
  },
  searchBar: {
    width: "96%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 20
  }
});
