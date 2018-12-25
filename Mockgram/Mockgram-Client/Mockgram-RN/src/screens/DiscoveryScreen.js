import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Discovery from '../pages/Discovery/Discovery';
import { Dimensions } from 'react-native';

export default DiscoveryStackNavigator = createStackNavigator({
    Discovery: {
        screen: Discovery
    }
})
