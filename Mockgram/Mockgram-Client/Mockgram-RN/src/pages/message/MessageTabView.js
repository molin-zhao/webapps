import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Following from './Following';
import You from './You';
export default class PostTabView extends React.Component {
    render() {
        return (
            <ScrollableTabView
                renderTabBar={() => <DefaultTabBar />}
                tabBarPosition='top'
                tabBarUnderlineStyle={styles.lineStyle}
                tabBarActiveTextColor='#eb765a'
                tabBarBackgroundColor='white'
                tabBarInactiveTextColor='black'
                initialPage={0}>
                <Following tabLabel='Following' />
                <You tabLabel='You' />
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
        justifyContent: 'center',
    },

    lineStyle: {
        backgroundColor: '#eb765a',
        width: windowWidth / 4,
        left: windowWidth / 8
    }
});