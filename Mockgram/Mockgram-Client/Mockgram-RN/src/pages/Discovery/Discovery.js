import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';




export default class Discovery extends React.Component {

    render() {
        return (
            < ScrollableTabView
                renderTabBar={() => <DefaultTabBar />
                }
                tabBarPosition='top'
                tabBarUnderlineStyle={{ backgroundColor: '#eb765a' }}
                tabBarActiveTextColor='#eb765a'
                tabBarBackgroundColor='white'
                tabBarInactiveTextColor='black'
                initialPage={0} >
                <Text tabLabel='People'></Text>
                <Text tabLabel='Tags'></Text>
                <Text tabLabel='Places'></Text>
            </ScrollableTabView>
        );
    }
}
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});