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
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SkypeIndicator } from "react-native-indicators";

import AjaxInput from "../../components/AjaxInput";
import Button from "../../components/Button";
import DropdownAlert from "../../components/DropdownAlert";

import theme from "../../common/theme";
import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";

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

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        borderBottomColor: "transparent",
        borderBottomWidth: 0,
        shadowColor: "transparent",
        elevation: 0
      },
      title: navigation.getParam("createTagTitle"),
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
          <Ionicons name="ios-arrow-back" size={theme.iconMd} />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    const { appLocale, navigation } = this.props;
    navigation.setParams({
      createTagLocation: `${locale[appLocale]["CREATE_TITLE"](
        locale[appLocale]["TAG"]
      )}`
    });
  }

  renderBtn = () => {
    const { nameSearchValue, nameValid, creating } = this.state;
    const { appLocale } = this.props;
    let valid = nameSearchValue && nameValid;
    return (
      <Button
        loading={creating}
        title={`${locale[appLocale]["CREATE"]}`}
        titleStyle={{ color: "#fff", fontSize: 12 }}
        iconLeft={() => {
          if (valid) {
            return null;
          }
          return <FontAwesome name="ban" size={18} color="#fff" />;
        }}
        disabled={!valid}
        onPress={() => {
          const { client } = this.props;
          if (client && client.token) {
            return fetch(`${baseUrl.api}/post/create/tag`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: client.token
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
          }
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
    const { appLocale } = this.props;
    if (created) {
      return (
        <View style={[styles.dropdown, { borderColor: theme.primaryGreen }]}>
          <Text style={{ color: theme.primaryGreen }}>{`${
            locale[appLocale]["CREATED_SUCCESSFULLY"]
          }`}</Text>
          <Ionicons
            name="ios-checkmark-circle-outline"
            size={theme.iconMd}
            color={theme.primaryGreen}
          />
        </View>
      );
    }
    return (
      <View style={[styles.dropdown, { borderColor: theme.primaryWarning }]}>
        <Text style={{ color: theme.primaryWarning }}>
          {`${locale[appLocale]["NOT_CREATED"](locale[appLocale]["TAG"])}`}
          )}`}
        </Text>
        <Ionicons
          name="ios-close-circle-outline"
          size={theme.iconMd}
          color={theme.primaryWarning}
        />
      </View>
    );
  };

  render() {
    const { appLocale } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView>
          <View style={styles.container}>
            <DropdownAlert ref={o => (this._dropdown = o)} timeout={3000}>
              {this.renderDropdownAlert()}
            </DropdownAlert>
            <View style={styles.input}>
              <AjaxInput
                label={() => {
                  return <Text>{`${locale[appLocale]["Name"]}:`}</Text>;
                }}
                textInputContainerStyle={{
                  borderWidth: 1,
                  borderColor: "lightgrey",
                  borderRadius: 10
                }}
                fetchUrl={`${baseUrl.api}/discovery/tag/available`}
                placeholder={`${locale[appLocale]["CREATE_FOR"](
                  locale[appLocale]["TAG"]
                )}`}
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
  client: state.client.client,
  appLocale: state.app.appLocale
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
