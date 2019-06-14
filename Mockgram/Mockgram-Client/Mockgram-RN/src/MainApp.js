import React from "react";
import { TouchableOpacity, AppState } from "react-native";
import {
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";
import { connect } from "react-redux";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// sreens
import Home from "./screens/Home";
import Discovery from "./screens/Discovery";
import Message from "./screens/Message";
import Profile from "./screens/Profile";
import Post from "./screens/Post";

// pages
import UserList from "./pages/Profile/UserList";
import UserProfile from "./pages/Profile/UserProfile";
import PostDetail from "./pages/Profile/PostDetail";
import InitPage from "./pages/InitPage";
import CommentPage from "./pages/Comment";
import Login from "./pages/Login";
import ImageFilter from "./pages/ImageFilter";

// components
import MessageBadgeIcon from "./components/MessageBadgeIcon";

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
        }
      }
    },
    Discovery: {
      screen: Discovery,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="md-search" color={tintColor} size={28} />
        )
      }
    },
    Post: {
      screen: Post,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-add-circle-outline" color={tintColor} size={28} />
        ),
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          const client = store.getState().client.client;
          if (client) {
            defaultHandler();
          } else {
            navigation.navigate("Auth");
          }
        }
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
        }
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
        }
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
      }
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
    InitPage: InitPage,
    ImageFilter: ImageFilter
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
      await this.props.getClientInfo();
      await this.props.getAppLocale();
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
      i18n
    } = this.props;
    if (prevProps.i18n !== i18n && i18n) {
      // i18n finished or changed
      console.log(`${i18n.t("SYSTEM_LANG")}`);
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
    i18n: state.app.i18n
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
