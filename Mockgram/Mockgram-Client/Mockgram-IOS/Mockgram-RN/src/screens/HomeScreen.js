import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from '../pages/Home';
import CommentPage from '../pages/Comment';

export default HomeStackNavigator = createStackNavigator({
    Home: {
        screen: HomePage
    },
    Comment: {
        screen: CommentPage
    }
}, {
        // router configuration
        navigationOptions: {
            title: 'Mockgram',
            headerStyle: {
                backgroundColor: 'white'
            },
            headerTitleStyle: {
                color: 'black',
                fontSize: 20
            }
        }
    })
