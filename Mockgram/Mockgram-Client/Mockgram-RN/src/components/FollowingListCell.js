import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import window from '../utils/getDeviceInfo';

class FollowingListCell extends React.Component {
    render() {
        const { navigation, dataSource } = this.props
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={0.8}
                onPress={() => {
                    navigation.navigate('FollowingMessage', { id: dataSource._id })
                }}
            >
                <View></View>

            </TouchableOpacity>
        );
    }
}
export default FollowingListCell;

const styles = StyleSheet.create({
    container: {
        height: window.height * 0.1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }

})