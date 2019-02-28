import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './screens/HomeScreen';
import Discovery from './screens/DiscoveryScreen';
import Profile from './screens/ProfileScreen';
import UserProfile from './pages/Profile/UserProfile';
import Post from './screens/PostScreen';
import Message from './screens/MessageScreen';
import Login from './screens/LoginScreen';
import CommentPage from './pages/Comment/Comment';
import MessageBadgeIcon from './components/MessageBadgeIcon';
import AuthIcon from './components/AuthIcon';

import { getClientInfo } from './redux/actions/clientActions';
import { getClientProfile } from './redux/actions/profileActions';
import { finishAppInitialize } from './redux/actions/appActions';
import { getMessage, addMessages, recallMessage } from './redux/actions/messageActions';
import theme from './common/theme';


const MainAppTabNavigator = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name="md-home" color={tintColor} size={28} />
            )
        }
    },
    Discovery: {
        screen: Discovery,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name="md-search" color={tintColor} size={28} />
            )
        }
    },
    Post: {
        screen: Post,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <AuthIcon name="ios-add-circle-outline" color={tintColor} size={28} router={{
                    target: 'Post',
                    auth: 'Auth'
                }} />
            )
        }
    },
    Message: {
        screen: Message,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <MessageBadgeIcon
                    name="ios-mail"
                    color={tintColor}
                    size={28}
                    auth={true}
                    router={{
                        target: 'Message',
                        auth: 'Auth'
                    }}
                />
            )
        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <AuthIcon name="md-person" color={tintColor} size={28} router={{
                    target: 'Profile',
                    auth: 'Auth'
                }} />
            )
        }
    }

}, {
        //router configuration
        initialRouteName: 'Home',
        order: ["Home", "Discovery", "Post", 'Message', 'Profile'],
        tabBarOptions: {
            activeTintColor: theme.primaryColor,
            inactiveTintColor: 'black',
            style: {
                backgroundColor: 'white',
            }
        }
    })

/**
 * MainAppStackNavigator only contains pages that display app contents
 * not including modals and other util pages
 */
const MainAppStackNavigator = createStackNavigator({
    MainApp: MainAppTabNavigator,
    UserProfile: UserProfile
}, {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    });

/**
 * RootNavigator contains all the pages in this app
 * including modals and stack navigators
 */
const RootNavigator = createStackNavigator({
    Main: MainAppStackNavigator,
    Comment: CommentPage,
    Auth: Login
}, {
        mode: 'modal',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    })

class MainApp extends React.Component {

    async componentDidMount() {
        const { getClientInfo, finishAppInitialize } = this.props;
        console.log('app starts');
        await getClientInfo();
        finishAppInitialize()
    }

    componentDidUpdate(prevProps) {
        const { client, socket, getClientProfile, getMessage, addMessages, recallMessage } = this.props;
        if (prevProps.client !== client && client) {
            // client has value
            getClientProfile(client.token);
            // getMessage(client.token);
        }
        if (prevProps.socket !== socket && socket) {
            // socket has been established
            socket.on('new-message', msg => {
                addMessages(msg);
            });
            socket.on('recall-message', msg => {
                recallMessage(msg);
            })
        }
    }


    render() {
        return (
            <RootNavigator />
        );
    }
}
const mapStateToProps = state => {
    return {
        socket: state.message.socket,
        message: state.message.message,
        client: state.client.client,
        profile: state.profile.profile
    }
}
const mapDispatchToProps = dispatch => ({
    getClientInfo: () => dispatch(getClientInfo()),
    getClientProfile: (token) => dispatch(getClientProfile(token)),
    getMessage: (token) => dispatch(getMessage(token)),
    finishAppInitialize: () => dispatch(finishAppInitialize()),
    addMessages: (messages) => dispatch(addMessages(messages)),
    recallMessage: (message) => dispatch(recallMessage(message))
})

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
