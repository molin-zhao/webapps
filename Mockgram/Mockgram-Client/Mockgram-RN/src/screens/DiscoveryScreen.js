import React from 'react';
import { createStackNavigator } from 'react-navigation';
import Discovery from '../pages/Discovery/Discovery';
import { SearchBar } from 'react-native-elements';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
export default DiscoveryStackNavigator = createStackNavigator({
    Discovery: {
        screen: Discovery,
        navigationOptions: {
            headerTitle: <SearchBar
                onChangeText={(text) => {
                    console.log(text);
                }}
                placeholder='search...'
                round
                lightTheme
                icon={{ type: 'font-awesome', name: 'search' }}
                containerStyle={{ borderBottomWidth: 0, borderTopWidth: 0, backgroundColor: 'white', width: windowWidth }}
                inputStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'lightgrey' }}
            />
        }
    }
})
