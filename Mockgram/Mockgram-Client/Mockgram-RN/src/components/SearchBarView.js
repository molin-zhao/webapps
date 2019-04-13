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
import Icon from "react-native-vector-icons/Ionicons";
import PropTypes from "prop-types";

import window from "../utils/getDeviceInfo";
import theme from "../common/theme";

export default class SearchBarView extends React.Component {
  static defaultProps = {
    style: { width: window.width, height: 50 }
  };

  static propTypes = {
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: "",
      container: this.props.container,
      searchBarWidth: new Animated.Value(this.props.style.width * 0.9),
      buttonWidth: new Animated.Value(this.props.style.width * 0.1)
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
    if (!this.state.text) {
      this.searchBarShrink();
    }
    const { container } = this.state;
    this.setState(
      {
        focused: true
      },
      () => {
        container.setState({
          focused: true
        });
      }
    );
  };

  _keyboardWillHide = () => {
    if (!this.state.text) {
      this.searchBarExtend();
    }
    const { container } = this.state;
    this.setState(
      {
        focused: false
      },
      () => {
        container.setState({
          focused: false
        });
      }
    );
  };

  _keyboardDidShow = () => {
    if (!this.state.text) {
      this.searchBarShrink();
    }
    const { container } = this.state;
    this.setState(
      {
        focused: true
      },
      () => {
        container.setState({
          focused: true
        });
      }
    );
  };

  _keyboardDidHide = () => {
    if (!this.state.text) {
      this.searchBarExtend();
    }
    const { container } = this.state;
    this.setState(
      {
        focused: false
      },
      () => {
        container.setState({
          focused: false
        });
      }
    );
  };

  searchBarShrink = () => {
    let width = this.props.style.width;
    Animated.parallel([
      Animated.timing(this.state.searchBarWidth, {
        toValue: width * 0.8,
        duration: 100
      }),
      Animated.timing(this.state.buttonWidth, {
        toValue: width * 0.2,
        duration: 100
      })
    ]).start();
  };

  searchBarExtend = () => {
    let width = this.props.style.width;
    Animated.parallel([
      Animated.timing(this.state.searchBarWidth, {
        toValue: width * 0.9,
        duration: 100
      }),
      Animated.timing(this.state.buttonWidth, {
        toValue: width * 0.1,
        duration: 100
      })
    ]).start();
  };

  renderButton = () => {
    const { focused, text } = this.state;
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
            let _focused = this._textInput.isFocused();
            this.setState(
              {
                text: ""
              },
              () => {
                this.state.container.setState({
                  searchBarInput: ""
                });
                if (_focused) {
                  Keyboard.dismiss();
                } else {
                  this.searchBarExtend();
                }
              }
            );
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 14, color: theme.primaryBlue }}>cancel</Text>
        </TouchableOpacity>
      );
    }
    return (
      <Icon
        name="md-qr-scanner"
        size={18}
        onPress={() => {
          console.log("scanning");
        }}
      />
    );
  };

  render() {
    const { style } = this.props;
    return (
      <View style={[styles.searchBarViewContainer, style]}>
        <Animated.View
          style={[
            { justifyContent: "center", alignItems: "center", height: "100%" },
            { width: this.state.searchBarWidth }
          ]}
        >
          <View style={styles.searchBar}>
            <View
              style={{
                width: "15%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Icon name="ios-search" size={18} />
            </View>
            <TextInput
              ref={o => (this._textInput = o)}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ width: "85%" }}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                // search bar is not empty
                this.setState(
                  {
                    text
                  },
                  () => {
                    let container = this.state.container;
                    clearTimeout(container.state.timer);
                    container.setState(
                      {
                        searchBarInput: text
                      },
                      () => {
                        if (text.length > 0) {
                          container.setState({
                            isSearching: true,
                            timer: setTimeout(() => {
                              container.setState(
                                {
                                  searchValue: text,
                                  timer: null
                                },
                                () => {
                                  clearTimeout(container.state.timer);
                                  container.startSearch();
                                }
                              );
                            }, 1000)
                          });
                        } else {
                          container.setState({
                            isSearching: false,
                            timer: null,
                            searchValue: ""
                          });
                        }
                      }
                    );
                  }
                );
              }}
              placeholder="search..."
              value={this.state.text}
            />
          </View>
        </Animated.View>
        <Animated.View
          style={[
            { justifyContent: "center", alignItems: "center", height: "100%" },
            { width: this.state.buttonWidth }
          ]}
        >
          {this.renderButton()}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchBarViewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 0
  },
  searchBar: {
    width: "95%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 20
  }
});
