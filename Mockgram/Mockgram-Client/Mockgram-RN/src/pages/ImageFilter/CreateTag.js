import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicon from "react-native-vector-icons/Ionicons";
import { SkypeIndicator } from "react-native-indicators";

import AjaxInput from "../../components/AjaxInput";
import Button from "../../components/Button";
import DropdowAlert from "../../components/DropdownAlert";

import theme from "../../common/theme";
import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";

class CreateTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValid: false,
      nameSearchValue: "",
      creating: false,
      created: false
    };
  }

  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      borderBottomColor: "transparent",
      borderBottomWidth: 0,
      shadowColor: "transparent",
      elevation: 0
    },
    title: "Create Tag",
    headerTitleStyle: {
      fontSize: 14
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

  renderBtn = () => {
    const { nameSearchValue, nameValid, creating } = this.state;
    let valid = nameSearchValue && nameValid;
    return (
      <Button
        loading={creating}
        title="create"
        titleStyle={{ color: "#fff", fontSize: 12 }}
        iconLeft={() => {
          if (valid) {
            return null;
          }
          return <Icon name="ban" size={18} color="#fff" />;
        }}
        disabled={!valid}
        onPress={() => {
          return fetch(`${baseUrl.api}/post/create/tag`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: nameSearchValue
            })
          })
            .then(res => res.json())
            .then(resJson => {
              if (resJson.status === 200) {
                this.setState({
                  created: true
                });
              } else {
                this.setState({
                  created: false
                });
              }
            })
            .then(() => {
              this.setState(
                {
                  creating: false
                },
                () => {
                  this._dropdown.show();
                }
              );
            })
            .catch(err => {
              console.log(err);
              this.setState({
                creating: false
              });
            });
        }}
        containerStyle={StyleSheet.flatten(styles.createBtn)}
        loadingIndicator={() => (
          <SkypeIndicator size={theme.iconSm} color={theme.primaryGrey} />
        )}
      />
    );
  };

  renderDropdownAlert = () => {
    const { created } = this.state;
    if (created) {
      return (
        <View style={[styles.dropdown, { borderColor: theme.primaryGreen }]}>
          <Text
            style={{ color: theme.primaryGreen }}
          >{`Created successfully`}</Text>
          <Ionicon
            name="ios-checkmark-circle-outline"
            size={theme.iconMd}
            color={theme.primaryGreen}
          />
        </View>
      );
    }
    return (
      <View style={[styles.dropdown, { borderColor: theme.primaryWarning }]}>
        <Text
          style={{ color: theme.primaryWarning }}
        >{`Tag was not created`}</Text>
        <Ionicon
          name="ios-close-circle-outline"
          size={theme.iconMd}
          color={theme.primaryWarning}
        />
      </View>
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView>
          <View style={styles.container}>
            <DropdowAlert ref={o => (this._dropdown = o)} timeout={3000}>
              {this.renderDropdownAlert()}
            </DropdowAlert>
            <View style={styles.input}>
              <AjaxInput
                label={() => {
                  return <Text>{`Name:`}</Text>;
                }}
                fetchUrl={`${baseUrl.api}/discovery/tag/available`}
                placeholder="Create a name for tag..."
                containerStyle={{ width: "100%", height: "100%" }}
                onValid={searchValue => {
                  this.setState({
                    nameValid: true,
                    nameSearchValue: searchValue
                  });
                }}
                onInValid={searchValue => {
                  this.setState({
                    nameValid: false,
                    nameSearchValue: searchValue
                  });
                }}
              />
            </View>
            {this.renderBtn()}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  client: state.client.client
});

export default connect(
  mapStateToProps,
  null
)(CreateTag);

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  input: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: 70,
    marginTop: 50
  },
  createBtn: {
    width: 90,
    height: 40,
    backgroundColor: theme.primaryColor,
    marginTop: 50
  },
  dropdown: {
    width: "95%",
    height: "95%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5
  }
});
