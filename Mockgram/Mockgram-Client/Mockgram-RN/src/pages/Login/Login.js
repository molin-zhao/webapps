import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  KeyboardAvoidingView
} from "react-native";
import { SecureStore, WebBrowser } from "expo";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { SkypeIndicator } from "react-native-indicators";

import * as LocalKeys from "../../common/localKeys";
import {
  clientLogin,
  loginError,
  oAuthLogin
} from "../../redux/actions/clientActions";

import CheckBox from "../../components/CheckBox";
import IconInput from "../../components/IconInput";
import Button from "../../components/Button";

import baseURL from "../../common/baseUrl";
import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";
import { locale } from "../../common/locale";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: "",
      loginPassword: "",
      rememberMe: false,
      processing: false
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
      title: navigation.getParam("loginTitle"),
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
      )
    };
  };

  componentDidMount() {
    const { navigation, appLocale } = this.props;
    navigation.setParams({
      loginTitle: `${locale[appLocale]["LOGIN"]}`
    });
    SecureStore.getItemAsync(LocalKeys.LOGIN_CREDENTIALS).then(data => {
      let creds = JSON.parse(data);
      if (creds) {
        this.setState({
          loginName: creds.loginName,
          loginPassword: creds.loginPassword,
          rememberMe: true
        });
      }
    });
  }

  _addLinkingListener = () => {
    // Add event listener for handle Mockgram://URLs
    Linking.addEventListener("url", this._handleLinking);
  };

  _removeLinkingListener = () => {
    // Remove event listener for handle Mockgram://URLs
    Linking.removeEventListener("url", this._handleLinking);
  };

  _handleLinking = () => {
    WebBrowser.dismissBrowser();
  };

  handleOAuthLogin = async name => {
    // Get app deep linking URL
    let redirectUrl = await Linking.getInitialURL();
    let OAuthURL = `${
      baseURL.api
    }/user/auth/${name}?redirectUrl=${redirectUrl}`;
    this._addLinkingListener();
    try {
      let response = await WebBrowser.openAuthSessionAsync(
        OAuthURL,
        redirectUrl
      );
      if (response.type === "success") {
        // user successful login
        const [, user_string] = response.url.match(/user=([^#]+)/);
        const clientInfo = JSON.parse(decodeURI(user_string));
        const { oAuthLogin, navigation } = this.props;
        oAuthLogin(clientInfo);
        SecureStore.setItemAsync(
          LocalKeys.CLIENT_INFO,
          JSON.stringify(clientInfo)
        ).then(() => {
          navigation.dismiss();
        });
      }
    } catch (err) {
      console.log("got error");
      console.log(err);
    }
    this._removeLinkingListener();
  };

  handleLogin = async () => {
    const { navigation, clientLogin, loginError } = this.props;
    let loginForm = {
      loginName: this.state.loginName,
      loginPassword: this.state.loginPassword
    };
    if (this.state.rememberMe) {
      await SecureStore.setItemAsync(
        LocalKeys.LOGIN_CREDENTIALS,
        JSON.stringify({
          loginName: loginForm.loginName,
          loginPassword: loginForm.loginPassword
        })
      ).catch(err => {
        console.log("Could not save credential info on local storage", err);
      });
    } else {
      await SecureStore.deleteItemAsync(LocalKeys.LOGIN_CREDENTIALS).catch(
        err => {
          console.log("Could not delete credential info on local storage", err);
        }
      );
    }
    // client login and set client info into local storage after modifying state
    clientLogin(loginForm)
      .then(clientInfo => {
        SecureStore.setItemAsync(
          LocalKeys.CLIENT_INFO,
          JSON.stringify(clientInfo)
        ).then(() => {
          this.setState({
            processing: false
          });
          navigation.dismiss();
        });
      })
      .catch(err => {
        this.setState(
          {
            processing: false
          },
          () => {
            loginError(err);
          }
        );
        console.log("Cannot set client info in local storage", err);
      });
  };

  renderLoginError = (error, defaultMsg) => {
    if (error) {
      return (
        <View style={styles.loginError}>
          <FontAwesome
            name="exclamation-circle"
            style={{ fontSize: 15, color: "red", marginRight: 5 }}
          />
          <Text style={{ color: "red", marginLeft: theme.paddingToWindow }}>
            {typeof error === "string" ? error : defaultMsg}
          </Text>
        </View>
      );
    }
    return null;
  };

  render() {
    const { appLocale } = this.props;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <IconInput
            icon={() => <FontAwesome name="user" size={20} />}
            placeholder={`${locale[appLocale]["EMAIL_OR_USERNAME"]}`}
            onChangeText={value => this.setState({ loginName: value })}
            value={this.state.loginName}
          />
          <IconInput
            icon={() => <FontAwesome name="unlock-alt" size={20} />}
            placeholder={`${locale[appLocale]["PASSWORD"]}`}
            onChangeText={password =>
              this.setState({ loginPassword: password })
            }
            secureTextEntry={true}
            value={this.state.loginPassword}
          />
          {this.renderLoginError(
            this.props.error,
            `${locale[appLocale]["LOGIN_ERROR"]}`
          )}
          <TouchableOpacity
            onPress={() =>
              this.setState({ rememberMe: !this.state.rememberMe })
            }
          >
            <View style={styles.formCheckbox}>
              <CheckBox
                containerStyle={{ width: "100%", height: "100%" }}
                title={`${locale[appLocale]["REMEMBER_ME"]}`}
                checked={this.state.rememberMe}
                onPress={() => {
                  this.setState({
                    rememberMe: !this.state.rememberMe
                  });
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.formButton}>
            <Button
              loading={this.state.processing}
              title={`${locale[appLocale]["LOGIN"]}`}
              titleStyle={{ color: "#fff", fontSize: 18 }}
              disabled={!this.state.loginName || !this.state.loginPassword}
              onPress={() => {
                this.setState(
                  {
                    processing: true
                  },
                  () => {
                    this.props.loginError(null);
                    this.handleLogin();
                  }
                );
              }}
              containerStyle={StyleSheet.flatten(styles.loginBtn)}
              loadingIndicator={() => (
                <SkypeIndicator size={theme.iconSm} color={theme.primaryGrey} />
              )}
            />
          </View>
          <View style={styles.formButton}>
            <Text
              style={{
                fontSize: 14,
                backgroundColor: null,
                color: theme.primaryColor
              }}
              onPress={() => {
                console.log("change mode");
              }}
            >
              {`${locale[appLocale]["LOGIN_WITH_PHONE"]}`}
            </Text>
            <Text style={{ fontSize: 20, marginLeft: 5, marginRight: 5 }}>
              |
            </Text>
            <Text
              style={{
                fontSize: 14,
                backgroundColor: null,
                color: theme.primaryColor
              }}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              {`${locale[appLocale]["REGISTER"]}`}
            </Text>
          </View>
        </KeyboardAvoidingView>
        <View style={styles.socialLogin}>
          <View
            style={{
              width: "100%",
              height: "20%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                backgroundColor: "lightgrey",
                height: 2,
                width: "30%",
                borderRadius: 1
              }}
            />
            <Text
              style={{
                marginLeft: 5,
                marginRight: 5,
                color: "grey",
                fontSize: 14
              }}
            >{`${locale[appLocale]["SOCIAL_MEDIA_LOGIN"]}`}</Text>
            <View
              style={{
                backgroundColor: "lightgrey",
                height: 2,
                width: "30%",
                borderRadius: 1
              }}
            />
          </View>
          <View
            style={{
              height: "80%",
              width: "100%",
              justifyContent: "space-around",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Ionicons
              onPress={() => {
                console.log("loggin with google");
                this.handleOAuthLogin("google");
              }}
              name="logo-googleplus"
              size={theme.iconLg}
              color="#c9312d"
            />
            <Ionicons
              onPress={() => {
                console.log("loggin with facebook");
                this.handleOAuthLogin("facebook");
              }}
              name="logo-facebook"
              size={theme.iconLg}
              color="#324e9d"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  formCheckbox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Math.floor(window.width * 0.3),
    height: theme.inputHeight,
    backgroundColor: null,
    marginTop: theme.marginTop
  },
  formButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Math.floor(window.width * 0.6),
    marginTop: theme.marginTop
  },
  loginError: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
    width: Math.floor(window.width * 0.7)
  },
  loginBtn: {
    width: Math.floor(window.width * 0.6),
    height: theme.inputHeight,
    borderRadius: theme.inputHeight / 2
  },
  socialLogin: {
    width: window.width,
    height: Math.floor(window.height * 0.4),
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = state => {
  return {
    client: state.client.client,
    error: state.client.error,
    appLocale: state.app.appLocale
  };
};

const mapDispatchToProps = dispatch => ({
  clientLogin: loginForm => dispatch(clientLogin(loginForm)),
  loginError: err => dispatch(loginError(err)),
  oAuthLogin: clientInfo => dispatch(oAuthLogin(clientInfo))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
