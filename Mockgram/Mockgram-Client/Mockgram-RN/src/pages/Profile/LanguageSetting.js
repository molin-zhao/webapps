import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";
import { setAppLocale } from "../../redux/actions/appActions";
import { Header } from "react-navigation";

import { locales_set } from "../../common/locale";
import window from "../../utils/getDeviceInfo";
import theme from "../../common/theme";
import { locale } from "../../common/locale";

class LanguageSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      language: this.props.appLocale
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
      title: navigation.getParam("languageSettingTitle"),
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
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{
            marginRight: 10,
            height: Header.HEIGHT * 0.5,
            width: Header.HEIGHT * 0.8,
            borderRadius: Header.HEIGHT * 0.1,
            backgroundColor: theme.primaryGreen,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={async () => {
            let changeLanguage = navigation.getParam("changeLanguage");
            await changeLanguage();
            navigation.goBack();
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {navigation.getParam("languageSettingDone")}
          </Text>
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    const { navigation, appLocale } = this.props;
    navigation.setParams({
      languageSettingTitle: `${locale[appLocale]["LANGUAGE_SETTING_TITLE"]}`,
      languageSettingDone: `${locale[appLocale]["DONE"]}`,
      changeLanguage: this.setLocale
    });
  }

  setLocale = async () => {
    const { setAppLocale, appLocale } = this.props;
    const { language } = this.state;
    if (language !== appLocale) {
      await setAppLocale(language);
    }
  };

  renderCheckMark = value => {
    const { language } = this.state;
    if (language === value) {
      return (
        <Ionicons
          style={{ marginRight: theme.paddingToWindow }}
          name="ios-checkmark"
          size={theme.iconMd}
          color={theme.primaryGreen}
        />
      );
    }
    return null;
  };

  render() {
    const { appLocale } = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          extraData={this.state}
          data={locales_set}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={{
                  width: window.width,
                  height: Math.floor(window.height * 0.08),
                  backgroundColor: "#fff",
                  borderBottomColor: "lightgrey",
                  borderBottomWidth: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
                onPress={() => {
                  this.setState({
                    language: item.value
                  });
                }}
              >
                <View
                  style={{
                    flex: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: "100%"
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ marginLeft: theme.paddingToWindow }}
                  >{`${locale[appLocale][item.key]}`}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  {this.renderCheckMark(item.value)}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  appLocale: state.app.appLocale
});

const mapDispatchToProps = dispatch => ({
  setAppLocale: localeString => dispatch(setAppLocale(localeString))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSetting);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center"
  }
});
