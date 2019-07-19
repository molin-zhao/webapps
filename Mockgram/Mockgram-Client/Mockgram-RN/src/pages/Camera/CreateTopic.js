import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { SkypeIndicator } from "react-native-indicators";

import AjaxInput from "../../components/AjaxInput";
import Button from "../../components/Button";
import DropdowAlert from "../../components/DropdownAlert";

import theme from "../../common/theme";
import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";

class CreateTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValid: false,
      nameSearchValue: "",
      topicDescription: "",
      creating: false,
      created: false,
      error: ""
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
      title: navigation.getParam("createTopicTitle"),
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
    const { navigation, appLocale } = this.props;
    navigation.setParams({
      CreateTopicTitle: `${locale[appLocale]["CREATE_TITLE"](
        locale[appLocale]["TOPIC"]
      )}`
    });
  }

  renderBtn = () => {
    const { appLocale } = this.props;
    const {
      nameSearchValue,
      nameValid,
      creating,
      topicDescription
    } = this.state;
    let valid = nameSearchValue && nameValid && topicDescription;
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
            return fetch(`${baseUrl.api}/post/create/topic`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: client.token
              },
              body: JSON.stringify({
                name: nameSearchValue,
                description: topicDescription
              })
            })
              .then(res => res.json())
              .then(resJson => {
                if (resJson.status === 200) {
                  this.setState({
                    created: true
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
        <Text style={{ color: theme.primaryWarning }}>{`${locale[appLocale][
          "NOT_CREATED"
        ](locale[appLocale]["TOPIC"])}`}</Text>
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
            <DropdowAlert ref={o => (this._dropdown = o)} timeout={3000}>
              {this.renderDropdownAlert()}
            </DropdowAlert>
            <View style={styles.input}>
              <AjaxInput
                label={() => {
                  return <Text>{`${locale[appLocale]["NAME"]}:`}</Text>;
                }}
                fetchUrl={`${baseUrl.api}/discovery/topic/available`}
                placeholder={`${locale[appLocale]["CREATE_FOR"](
                  locale[appLocale]["TOPIC"]
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
            <View
              style={[
                styles.input,
                { height: window.height * 0.2, alignItems: "flex-start" }
              ]}
            >
              <View
                style={{
                  flex: 3,
                  justifyContent: "flex-start",
                  alignItems: "flex-end"
                }}
              >
                <Text>{`Description:`}</Text>
              </View>
              <View
                style={{
                  flex: 7,
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <TextInput
                  style={{
                    height: "90%",
                    width: "96%",
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "lightgrey"
                  }}
                  placeholder={`${locale[appLocale]["CREATE_FOR"](
                    locale[appLocale]["TOPIC"]
                  )}`}
                  numberOfLines={4}
                  multiline={true}
                  onChangeText={text => {
                    this.setState({
                      topicDescription: text
                    });
                  }}
                  value={this.state.topicDescription}
                />
              </View>
            </View>
            <View style={[styles.input, { height: 20, marginTop: 5 }]}>
              <View style={{ flex: 3 }} />
              <View
                style={{
                  flex: 7,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    width: "94%",
                    fontSize: 12,
                    color: theme.primaryDanger
                  }}
                >
                  {this.state.error}
                </Text>
              </View>
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
)(CreateTopic);

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
    height: 50,
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
