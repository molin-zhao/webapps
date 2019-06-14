import React from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import { SkypeIndicator } from "react-native-indicators";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

import theme from "../common/theme";
import config from "../common/config";
import window from "../utils/getDeviceInfo";

class AjaxInput extends React.Component {
  static defaultProps = {
    containerStyle: {
      width: window.width * 0.7,
      height: 70
    },
    icon: () => null,
    label: () => null
  };

  static propTypes = {
    containerStyle: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      isSearching: false,
      searchValue: "",
      text: "",

      // state properties for public use
      isValid: true
    };
  }

  startSearch = () => {
    const { fetchUrl, onValid, onInValid } = this.props;
    const { searchValue } = this.state;
    if (fetchUrl) {
      return fetch(`${fetchUrl}?value=${searchValue}`, { method: "GET" })
        .then(res => res.json())
        .then(resJson => {
          console.log(resJson);
          if (resJson.status === 200) {
            this.setState(
              {
                isValid: true,
                isSearching: false
              },
              () => {
                onValid(searchValue);
              }
            );
          } else {
            this.setState(
              {
                isValid: false,
                isSearching: false
              },
              () => {
                onInValid(searchValue);
              }
            );
          }
        })
        .catch(err => {
          this.setState({
            isSearching: false
          });
        });
    } else {
      console.log(searchValue);
    }
  };

  renderIndicator = () => {
    const { text, isSearching, isValid } = this.state;
    if (text) {
      if (isSearching) {
        return <SkypeIndicator size={theme.iconSm} color="lightgrey" />;
      } else {
        if (isValid) {
          return (
            <Ionicons name="ios-checkmark" color="green" size={theme.iconMd} />
          );
        }
        return <Ionicons name="ios-close" color="red" size={theme.iconMd} />;
      }
    }
    return null;
  };

  renderLabel = () => {
    const { icon, label } = this.props;
    if (icon()) {
      return <View style={styles.formIonicons}>{icon()}</View>;
    } else if (label()) {
      return <View style={styles.formLabel}>{label()}</View>;
    } else {
      return null;
    }
  };

  renderTextColor = () => {
    const { isSearching, isValid } = this.state;
    if (isSearching) {
      return "black";
    } else {
      if (isValid) {
        return theme.primaryGreen;
      }
      return theme.primaryDanger;
    }
  };

  renderInValid = () => {
    const { searchValue, isValid, isSearching } = this.state;
    if (!isSearching && searchValue && !isValid) {
      return (
        <Text
          ellipsizeMode="tail"
          style={{ fontSize: 12, color: theme.primaryDanger, width: "90%" }}
        >{`'${searchValue}' has been created`}</Text>
      );
    }
    return <Text style={{ fontSize: 14, width: "90%" }}>{``}</Text>;
  };

  render() {
    const {
      placeholder,
      containerStyle,
      onInValid,
      textInputContainerStyle
    } = this.props;
    const { timer } = this.state;
    return (
      <View style={[styles.formInput, containerStyle]}>
        <View style={[styles.formDivision, { height: "65%" }]}>
          {this.renderLabel()}
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "65%",
                height: "100%",
                marginLeft: "5%"
              },
              textInputContainerStyle
            ]}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "80%",
                height: "100%"
              }}
            >
              <TextInput
                style={{
                  fontSize: 14,
                  width: "95%",
                  color: this.renderTextColor()
                }}
                placeholder={placeholder}
                onChangeText={text =>
                  this.setState({ text }, () => {
                    clearTimeout(timer);
                    if (text.length > 0) {
                      this.setState({
                        isSearching: true,
                        timer: setTimeout(() => {
                          this.setState(
                            {
                              searchValue: text,
                              timer: null
                            },
                            () => {
                              clearTimeout(timer);
                              this.startSearch();
                            }
                          );
                        }, config.ajaxQueryDuration)
                      });
                    } else {
                      this.setState(
                        {
                          isSearching: false,
                          timer: null,
                          searchValue: ""
                        },
                        () => {
                          onInValid("");
                        }
                      );
                    }
                  })
                }
                value={this.state.text}
                underlineColorAndroid="transparent"
              />
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 5,
                width: "15%",
                height: "100%",
                marginLeft: "5%"
              }}
            >
              {this.renderIndicator()}
            </View>
          </View>
        </View>
        <View style={[styles.formDivision, { height: "35%" }]}>
          <View style={{ flex: 3 }} />
          <View
            style={{ flex: 6, justifyContent: "center", alignItems: "center" }}
          >
            {this.renderInValid()}
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }

  // public methods
  getValue = () => {
    return this.state.text;
  };
  isValid = () => {
    return this.state.isValid;
  };
}

export default AjaxInput;

const styles = StyleSheet.create({
  formInput: {
    justifyContent: "flex-start",
    alignItems: "center"
  },
  formDivision: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  formLabel: {
    width: "30%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  formIonicons: {
    width: "30%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  }
});
