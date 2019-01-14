import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import window from '../utils/getDeviceInfo';

export default class Header extends React.Component {
    render() {
        const { headerTitle, leftIconButton, rightIconButton, titleOnPress, leftButtonOnPress, rightButtonOnPress } = this.props;
        return (
            <View style={[styles.header, { ...this.props.style }]}>
                <TouchableOpacity activeOpacity={0.8} style={styles.headerLeft} onPress={leftButtonOnPress}>
                    {leftIconButton}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.headerMiddle} onPress={titleOnPress}>
                    <Text>{headerTitle}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} style={styles.headerRight} onPress={rightButtonOnPress}>
                    {rightIconButton}
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        marginTop: getStatusBarHeight(),
        height: window.height * 0.1 - getStatusBarHeight() / 2,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1
    },
    headerMiddle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 3

    },
    headerRight: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1
    }
})