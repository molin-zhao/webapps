import React from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { connect } from "react-redux";
import ProfilePage from "../../components/ProfilePage";
import Drawer from "../../components/Drawer";
import HeaderTitle from "../../components/HeaderTitle";

import theme from "../../common/theme";
import window from "../../utils/getDeviceInfo";
import { locale } from "../../common/locale";
import DrawerItem from "../../components/DrawerItem";

class ProfileIndex extends React.Component {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        shadowColor: "transparent",
        elevation: 0
      },
      headerTitle: <HeaderTitle title="MY_PROFILE" />,
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: theme.headerIconMargin }}
          onPress={() => {
            let drawer = navigation.getParam("drawer");
            if (drawer.isDrawerOpen()) {
              return drawer.closeDrawer();
            } else {
              return drawer.openDrawer();
            }
          }}
        >
          <FontAwesome name="bars" size={theme.iconMd} />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      drawer: this._drawer
    });
  }

  render() {
    const { profile, navigation, appLocale } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this._drawer.closeDrawer();
        }}
      >
        <View style={{ flex: 1 }}>
          <ProfilePage clientProfile={true} />
          <Drawer
            containerStyle={{
              width: window.width * 0.45,
              borderLeftWidth: 3,
              borderColor: "lightgrey"
            }}
            ref={o => (this._drawer = o)}
          >
            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: "100%"
              }}
            >
              <DrawerItem
                btnText={() => (
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {profile ? profile.username : "Mockgram"}
                  </Text>
                )}
              />
              <DrawerItem
                icon={() => <FontAwesome name="cog" size={theme.iconSm} />}
                btnText={() => (
                  <Text numberOfLines={1} ellipsizeMode="tail">{`${
                    locale[appLocale]["PROFILE_SETTINGS"]
                  }`}</Text>
                )}
                onPress={() => {
                  navigation.navigate("ProfileSetting");
                  this._drawer.closeDrawer();
                }}
              />
              <DrawerItem
                icon={() => <FontAwesome name="language" size={theme.iconSm} />}
                btnText={() => (
                  <Text numberOfLines={1} ellipsizeMode="tail">{`${
                    locale[appLocale]["CHANGE_LANGUAGE"]
                  }`}</Text>
                )}
                onPress={() => {
                  navigation.navigate("LanguageSetting");
                  this._drawer.closeDrawer();
                }}
              />
              <DrawerItem
                icon={() => (
                  <FontAwesome name="credit-card" size={theme.iconSm} />
                )}
                btnText={() => (
                  <Text numberOfLines={1} ellipsizeMode="tail">{`${
                    locale[appLocale]["BUSINESS_PLAN"]
                  }`}</Text>
                )}
                onPress={() => {
                  console.log("business");
                }}
              />
              <DrawerItem
                icon={() => (
                  <FontAwesome
                    name="sign-out"
                    size={theme.iconSm}
                    color={theme.primaryDanger}
                  />
                )}
                btnText={() => (
                  <Text
                    style={{ color: theme.primaryDanger }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >{`${locale[appLocale]["LOGOUT"]}`}</Text>
                )}
                onPress={() => {
                  console.log("logout");
                }}
              />
            </View>
          </Drawer>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
  appLocale: state.app.appLocale
});

export default connect(
  mapStateToProps,
  null
)(ProfileIndex);
