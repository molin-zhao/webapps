import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './screens/HomeScreen';
import Discovery from './screens/DiscoveryScreen';
import Profile from './screens/ProfileScreen';
import Post from './screens/PostScreen';
import Message from './screens/MessageScreen';
import Login from './screens/LoginScreen';
import CommentPage from './pages/Comment/Comment';
import BadgeIcon from './components/BadgeIcon';
import AuthIcon from './components/AuthIcon';

import { getClientInfo } from './redux/actions/clientActions';


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
                <AuthIcon name="md-add" color={tintColor} size={28} router={{
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
                <BadgeIcon name="ios-mail" color={tintColor} size={28} auth={true} router={{
                    target: 'Message',
                    auth: 'Auth'
                }} />
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

const RootNavigator = createStackNavigator({
    MainAppStackNavigator: MainAppStackNavigator,
    Comment: CommentPage
}, {
        mode: 'modal',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    })

class MainApp extends React.Component {

    componentDidMount() {
        console.log('app starts');
        this.props.getClientInfo();
    }


    render() {
        return (
            <RootNavigator />
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getClientInfo: () => dispatch(getClientInfo())
})

export default connect(null, mapDispatchToProps)(MainApp);
