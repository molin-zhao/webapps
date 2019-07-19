import React from "react";
import { TouchableOpacity, AppState } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { connect } from "react-redux";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Permissions } from "expo";

// sreens
import Home from "./screens/Home";
import Discovery from "./screens/Discovery";
import Message from "./screens/Message";
import Profile from "./screens/Profile";

// pages
import UserList from "./pages/Profile/UserList";
import UserProfile from "./pages/Profile/UserProfile";
import PostDetail from "./pages/Profile/PostDetail";
import InitPage from "./pages/InitPage";
import CommentPage from "./pages/Comment";
import Login from "./pages/Login";
import Camera from "./pages/Camera";

// components
import MessageBadgeIcon from "./components/MessageBadgeIcon";
import I18nTabBarLabel from "./components/I18nTabBarLabel";

// actions and utils
import store from "./redux";
import { getClientInfo } from "./redux/actions/clientActions";
import { getClientProfile } from "./redux/actions/profileActions";
import { finishAppInitialize, getAppLocale } from "./redux/actions/appActions";
import { updateLastMessageId } from "./redux/actions/messageActions";
import {
  getMessage,
  addMessage,
  recallMessage
} from "./redux/actions/messageActions";
import theme from "./common/theme";
import { locale } from "./common/locale";

const MainAppTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-home" color={tintColor} size={28} />
        ),
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          if (navigation.isFocused()) {
            console.log("double tapped");
          }
          defaultHandler();
        },
        tabBarLabel: ({ tintColor, focused }) => (
          <I18nTabBarLabel
            name="TAB_HOME"
            tintColor={tintColor}
            focused={focused}
          />
        )
      }
    },
    Discovery: {
      screen: Discovery,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-search" color={tintColor} size={28} />
        ),
        tabBarLabel: ({ tintColor, focused }) => (
          <I18nTabBarLabel
            name="TAB_DISCOVERY"
            tintColor={tintColor}
            focused={focused}
          />
        )
      }
    },
    Post: {
      screen: () => null,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-add-circle-outline" color={tintColor} size={28} />
        ),
        tabBarOnPress: async ({ navigation }) => {
          const client = store.getState().client.client;
          if (client) {
            let cmpmsn = await Permissions.getAsync(Permissions.CAMERA);
            if (cmpmsn.status === "granted") {
              navigation.navigate("Camera");
            } else {
              let askpmsn = await Permissions.askAsync(Permissions.CAMERA);
              if (askpmsn.status === "granted") {
                navigation.navigate("Camera");
              } else {
                return;
              }
            }
          } else {
            navigation.navigate("Auth");
          }
        },
        tabBarLabel: ({ tintColor, focused }) => (
          <I18nTabBarLabel
            name="TAB_POST"
            tintColor={tintColor}
            focused={focused}
          />
        )
      }
    },
    Message: {
      screen: Message,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <MessageBadgeIcon name="ios-mail" color={tintColor} size={28} />
        ),
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          const client = store.getState().client.client;
          if (client) {
            updateLastMessageId();
            defaultHandler();
          } else {
            navigation.navigate("Auth");
          }
        },
        tabBarLabel: ({ tintColor, focused }) => (
          <I18nTabBarLabel
            name="TAB_MESSAGE"
            tintColor={tintColor}
            focused={focused}
          />
        )
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-person" color={tintColor} size={28} />
        ),
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          const client = store.getState().client.client;
          if (client) {
            defaultHandler();
          } else {
            navigation.navigate("Auth");
          }
        },
        tabBarLabel: ({ tintColor, focused }) => (
          <I18nTabBarLabel
            name="TAB_PROFILE"
            tintColor={tintColor}
            focused={focused}
          />
        )
      }
    }
  },
  {
    //router configuration
    initialRouteName: "Home",
    order: ["Home", "Discovery", "Post", "Message", "Profile"],
    tabBarOptions: {
      activeTintColor: theme.primaryColor,
      inactiveTintColor: "black",
      style: {
        backgroundColor: "#fff"
      },
      showLabel: true
    }
  }
);

/**
 * MainAppStackNavigator only contains pages that display app contents
 * not including modals and other util pages
 */
const MainAppStackNavigator = createStackNavigator({
  Main: {
    screen: MainAppTabNavigator,
    navigationOptions: {
      header: null
    }
  },
  UserList: {
    screen: UserList,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("type", "Follower"),
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>
      )
    })
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: ({ navigation }) => ({
      title: navigation.getParam("title", "username"),
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>
      )
    })
  },
  PostDetail: {
    screen: PostDetail,
    navigationOptions: ({ navigation }) => ({
      title: "Post",
      headerLeft: (
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>
      )
    })
  }
});

/**
 * RootNavigator contains all the pages in this app
 * including modals and stack navigators
 */
const RootNavigator = createStackNavigator(
  {
    Main: MainAppStackNavigator,
    Comment: CommentPage,
    Auth: Login,
    InitPage,
    Camera
  },
  {
    mode: "modal",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
  }

  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    try {
      await this.props.getAppLocale();
      await this.props.getClientInfo();
      await this.props.finishAppInitialize();
      console.log(`app starts`);
    } catch (err) {
      console.log(err);
    }
  }

  componentWillMount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    const { appState } = this.state;
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App comes to foreground!");
    } else if (appState.match(/active/) && nextAppState === "background") {
      console.log("App comes to background");
    } else {
      // nextAppState is inactive
      console.log("App is temporarily inactive");
    }
    this.setState({
      appState: nextAppState
    });
  };

  componentDidUpdate(prevProps) {
    const {
      client,
      socket,
      getClientProfile,
      getMessage,
      addMessage,
      recallMessage,
      appLocale
    } = this.props;
    if (prevProps.appLocale !== appLocale) {
      console.log(`${locale[appLocale]["SYSTEM_LANG"]}`);
    }
    if (prevProps.client !== client && client) {
      // client has value
      getClientProfile(client.token);
      getMessage(client.token);
    }
    if (prevProps.socket !== socket && socket && client) {
      // socket has been established
      socket.on("new-message", msg => {
        addMessage(msg);
        let messageId = msg[0]._id;
        socket.emit("received-message", {
          userId: client.user._id,
          messageId: messageId
        });
      });
      socket.on("recall-message", msg => {
        recallMessage(msg);
        let messageId = msg[0];
        socket.emit("recalled-message", {
          userId: client.user._id,
          messageId: messageId
        });
      });
    }
  }

  render() {
    return <RootNavigator />;
  }
}
const mapStateToProps = state => {
  return {
    socket: state.message.socket,
    message: state.message.message,
    client: state.client.client,
    profile: state.profile.profile,
    appLocale: state.app.appLocale
  };
};
const mapDispatchToProps = dispatch => ({
  getClientInfo: () => dispatch(getClientInfo()),
  getClientProfile: token => dispatch(getClientProfile(token)),
  getAppLocale: () => dispatch(getAppLocale()),
  getMessage: token => dispatch(getMessage(token)),
  finishAppInitialize: () => dispatch(finishAppInitialize()),
  addMessage: messages => dispatch(addMessage(messages)),
  recallMessage: message => dispatch(recallMessage(message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp);
