import React from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { SkypeIndicator } from "react-native-indicators";
import { connect } from "react-redux";

import Button from "../../components/Button";
import IconInput from "../../components/IconInput";

import formValidation from "../../utils/formValidation";
import baseUrl from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";
import { locale } from "../../common/locale";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      valid: false,
      processing: false,
      errors: {
        username: {
          status: false,
          message: ""
        },
        email: {
          status: false,
          message: ""
        },
        password: {
          status: false,
          message: ""
        },
        confirmPassword: {
          status: false,
          message: ""
        }
      },
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
      title: navigation.getParam("registerTitle"),
      headerTitleStyle: {
        fontSize: 14
      },
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: theme.headerIconMargin }}
          onPress={() => {
            navigation.dismiss();
          }}
        >
          <Ionicons name="md-close" size={theme.iconMd} />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: theme.headerIconMargin }}
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
      registerTitle: `${locale[appLocale]["REGISTER"]}`
    });
  }

  allTouched = () => {
    return (
      this.state.username !== "" &&
      this.state.email !== "" &&
      this.state.password !== "" &&
      this.state.confirmPassword !== ""
    );
  };

  renderRegisterError = defaultMsg => {
    const { error } = this.state;
    if (error) {
      return (
        <Text style={styles.registerError}>
          <FontAwesome
            name="exclamation-circle"
            style={{ fontSize: 15, color: "red", marginRight: 5 }}
          />
          {typeof error === "string" ? error : defaultMsg}
        </Text>
      );
    }
    return null;
  };

  register() {
    fetch(`${baseUrl.api}/user/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      })
    })
      .then(res => res.json())
      .then(resJson => {
        if (resJson.status === 200) {
          // register success
          this.setState({
            error: ""
          });
          this.props.navigation.navigate("Login", {
            loginName: this.state.username,
            loginPassword: this.state.password,
            loginError: "",
            rememberme: false
          });
        } else {
          // register error
          this.setState({
            error: resJson.msg
          });
        }
      })
      .then(() => {
        this.setState({
          processing: false
        });
      })
      .catch(err => {
        this.setState({
          processing: false,
          error: err
        });
        console.log(err);
      });
  }

  render() {
    const { appLocale } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <IconInput
              icon={() => <FontAwesome name="envelope" size={20} />}
              placeholder={`${locale[appLocale]["EMAIL"]}`}
              onChangeText={email => {
                this.setState({ email });
                formValidation(
                  this,
                  this.state.errors.email,
                  "Email",
                  email,
                  "isEmail",
                  null
                );
              }}
              value={this.state.email}
            />
            <Text style={styles.formValidationMessage}>
              {this.state.errors.email.status
                ? this.state.errors.email.message
                : null}
            </Text>
            <IconInput
              icon={() => <FontAwesome name="user" size={20} />}
              placeholder={`${locale[appLocale]["USERNAME"]}`}
              onChangeText={username => {
                this.setState({ username });
                formValidation(
                  this,
                  this.state.errors.username,
                  "Username",
                  username,
                  "isAlphanumberic",
                  null
                );
              }}
              value={this.state.username}
            />
            <Text style={styles.formValidationMessage}>
              {this.state.errors.username.status
                ? this.state.errors.username.message
                : null}
            </Text>
            <IconInput
              icon={() => <FontAwesome name="key" size={20} />}
              placeholder={`${locale[appLocale]["PASSWORD"]}`}
              onChangeText={password => {
                this.setState({ password });
                formValidation(
                  this,
                  this.state.errors.password,
                  "Password",
                  password,
                  "isPassword",
                  null
                );
              }}
              value={this.state.password}
              secureTextEntry={true}
            />
            <Text style={styles.formValidationMessage}>
              {this.state.errors.password.status
                ? this.state.errors.password.message
                : null}
            </Text>
            <IconInput
              icon={() => <FontAwesome name="lock" size={20} />}
              placeholder={`${locale[appLocale]["CONFIRM_PASSWORD"]}`}
              onChangeText={confirmPassword => {
                this.setState({ confirmPassword });
                formValidation(
                  this,
                  this.state.errors.confirmPassword,
                  "Confirm password",
                  confirmPassword,
                  "isConfirmPassword",
                  this.state.password
                );
              }}
              value={this.state.confirmPassword}
              secureTextEntry={true}
            />
            <Text style={styles.formValidationMessage}>
              {this.state.errors.confirmPassword.status
                ? this.state.errors.confirmPassword.message
                : null}
            </Text>
            {this.renderRegisterError(`${locale[appLocale]["REGISTER_ERROR"]}`)}
            <Button
              loading={this.state.processing}
              title={`${locale[appLocale]["REGISTER"]}`}
              titleStyle={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}
              disabled={!this.state.valid || !this.allTouched()}
              onPress={() => {
                this.setState(
                  {
                    processing: true
                  },
                  () => {
                    this.register();
                  }
                );
              }}
              containerStyle={StyleSheet.flatten(styles.registerBtn)}
              loadingIndicator={() => (
                <SkypeIndicator size={theme.iconSm} color={theme.primaryGrey} />
              )}
            />
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(Register);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  formInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: window.width * 0.7,
    height: theme.inputHeight,
    marginTop: theme.marginTop
  },
  formButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: window.width * 0.6,
    marginTop: theme.marginTop
  },
  registerBtn: {
    marginTop: theme.marginTop,
    height: theme.inputHeight,
    width: Math.floor(window.width * 0.6),
    backgroundColor: theme.primaryColor,
    borderRadius: theme.inputHeight / 2
  },
  registerError: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    flexWrap: "wrap",
    width: window.width * 0.7,
    color: "red",
    fontSize: 15
  },
  formValidationMessage: {
    width: window.width * 0.7,
    fontSize: 15,
    color: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    flexWrap: "wrap"
  }
});
