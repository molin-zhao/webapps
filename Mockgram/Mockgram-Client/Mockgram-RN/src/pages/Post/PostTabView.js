import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from 'react-native';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Camera from './Camera';
import Library from './Library';
export default class PostTabView extends React.Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            headerStyle: {
                borderBottomColor: 'transparent',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0
            }
        }
    }
    render() {
        return (
            <ScrollableTabView
                style={{ backgroundColor: '#fff' }}
                renderTabBar={() => <DefaultTabBar />}
                tabBarPosition='top'
                tabBarUnderlineStyle={styles.lineStyle}
                tabBarActiveTextColor='#eb765a'
                tabBarBackgroundColor='white'
                tabBarInactiveTextColor='black'
                initialPage={0}>
                <Library navigation={this.props.navigation} tabLabel='Library' />
                <Camera navigation={this.props.navigation} tabLabel='Camera' />
            </ScrollableTabView>
        );
    }
}

const windowWith = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    lineStyle: {
        backgroundColor: '#eb765a',
        width: windowWith / 4,
        left: windowWith / 8
    }
});