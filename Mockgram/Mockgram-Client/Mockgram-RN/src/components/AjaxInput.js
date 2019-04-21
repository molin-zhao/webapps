import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { BallIndicator } from "react-native-indicators";
import Icon from "react-native-vector-icons/Ionicons";

import theme from "../common/theme";
import config from "../common/config";

class AjaxInput extends React.Component {
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
    const { fetchUrl } = this.props;
    return fetch(fetchUrl, { method: "GET" })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          this.setState({
            isValid: true,
            isSearching: false
          });
        } else {
          this.setState({
            isValid: false,
            isSearching: false
          });
        }
      })
      .catch(err => {
        this.setState({
          isSearching: false
        });
      });
  };

  renderIndicator = () => {
    const { text, isSearching, isValid } = this.state;
    if (text) {
      if (isSearching) {
        return <BallIndicator size={theme.iconMd} color="lightgrey" />;
      } else {
        if (isValid) {
          return (
            <Icon name="ios-checkmark" color="green" size={theme.iconMd} />
          );
        }
        return <Icon name="ios-close" color="red" size={theme.iconMd} />;
      }
    }
    return null;
  };

  render() {
    const { placeholder, containerStyle } = this.props;
    const { timer } = this.state;
    return (
      <View style={[styles.formInput, containerStyle]}>
        <TextInput
          style={{ marginLeft: 10, fontSize: 14, width: "80%" }}
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
                this.setState({
                  isSearching: false,
                  timer: null,
                  searchValue: ""
                });
              }
            })
          }
          value={this.state.text}
          underlineColorAndroid="transparent"
        />
        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderIndicator()}
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
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: window.width * 0.7,
    height: 50,
    marginTop: 50
  }
});
