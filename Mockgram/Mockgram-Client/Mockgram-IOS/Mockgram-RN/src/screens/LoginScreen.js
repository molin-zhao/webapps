import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator } from 'react-navigation';
import LoginPage from '../pages/Login/Login';
import RegisterPage from '../pages/Login/Register';
import LoginModePage from '../pages/Login/LoginMode';
export default LoginStackNavigator = createStackNavigator({
    Login: {
        screen: LoginPage,
        navigationOptions: ({ navigation }) => ({
            headerStyle: {
                borderBottomColor: 'transparent',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerRight: (
                <TouchableOpacity style={{ marginRight: 20 }}
                    onPress={() => {
                        navigation.navigate('Home');
                    }}>
                    <Icon name='times' size={24} />
                </TouchableOpacity>
            )
        })

    },
    Register: {
        screen: RegisterPage,
        navigationOptions: ({ navigation }) => ({
            headerStyle: {
                borderBottomColor: 'transparent',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerRight: (
                <TouchableOpacity style={{ marginRight: 20 }}
                    onPress={() => {
                        navigation.navigate('Home');
                    }}>
                    <Icon name='times' size={24} />
                </TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 20 }}
                    onPress={() => {
                        navigation.popToTop();
                    }}>
                    <Icon name='chevron-left' size={20} />
                </TouchableOpacity>
            )
        })
    },
    LoginMode: {
        screen: LoginModePage,
        navigationOptions: ({ navigation }) => ({
            headerStyle: {
                borderBottomColor: 'transparent',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerRight: (
                <TouchableOpacity style={{ marginRight: 20 }}
                    onPress={() => {
                        navigation.navigate('Home');
                    }}>
                    <Icon name='times' size={24} />
                </TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 20 }}
                    onPress={() => {
                        navigation.popToTop();
                    }}>
                    <Icon name='chevron-left' size={20} />
                </TouchableOpacity>
            )
        })
    }
})
