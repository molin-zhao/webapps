import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Home from './screens/HomeScreen';
import Discovery from './screens/DiscoveryScreen';
import Profile from './screens/ProfileScreen';
import Post from './screens/PostScreen';
import Message from './screens/MessageScreen';
import Login from './screens/LoginScreen';
import CommentPage from './pages/Comment/Comment';
import Icon from 'react-native-vector-icons/FontAwesome';
import BadgeIcon from './components/BadgeIcon';


const MainAppTabNavigator = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name="home" color={tintColor} size={28} />
            )
        }
    },
    Discovery: {
        screen: Discovery,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name="search" color={tintColor} size={25} />
            )
        }
    },
    Post: {
        screen: Post,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name="plus-circle" color={tintColor} size={28} />
            ),
            tabBarOnPress: (scene, jumpToIndex) => {
                if (!global.userinfo) {
                    scene.navigation.navigate('Auth');
                } else {
                    scene.navigation.navigate('Post')
                }
            }
        }
    },
    Message: {
        screen: Message,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <BadgeIcon name="envelope-o" color={tintColor} size={26} />
            ),
            tabBarOnPress: (scene, jumpToIndex) => {
                if (!global.userinfo) {
                    scene.navigation.navigate('Auth');
                } else {
                    scene.navigation.navigate('Message')
                }
            }

        }
    },
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <Icon name="user" color={tintColor} size={26} />
            ),
            tabBarOnPress: (scene) => {
                if (!global.userinfo) {
                    scene.navigation.navigate('Auth');
                } else {
                    fetch(`${baseUrl.api}/user/profile/${global.userinfo.user._id}`).then(res => res.json()).then(resJson => {
                        global.userinfo.user = resJson.user;
                        scene.navigation.navigate('Profile');
                    })
                }
            }
        }
    }

}, {
        //router configuration
        initialRouteName: 'Home',
        order: ["Home", "Discovery", "Post", 'Message', 'Profile'],
        tabBarOptions: {
            activeTintColor: '#eb765a',
            inactiveTintColor: 'black',
            style: {
                backgroundColor: 'white',
            }
        }
    })

const MainAppStackNavigator = createStackNavigator({
    MainApp: MainAppTabNavigator,
    Auth: Login
}, {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    });

export default createStackNavigator({
    MainAppStackNavigator: MainAppStackNavigator,
    Comment: CommentPage
}, {
        mode: 'modal',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    })
