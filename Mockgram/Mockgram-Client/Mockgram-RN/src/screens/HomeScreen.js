import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from '../pages/Home/Home';

export default HomeStackNavigator = createStackNavigator({
    Home: {
        screen: HomePage
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
