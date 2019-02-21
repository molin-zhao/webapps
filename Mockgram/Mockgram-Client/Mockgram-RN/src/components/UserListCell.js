import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Thumbnail from './Thumbnail';
import window from '../utils/getDeviceInfo';

import { userAvatar } from '../utils/getUserInfo';
import { styles } from '../common/styles';

export default class UserListCell extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { dataSource } = this.props;
        return (
            <View style={{
                borderWidth: 0,
                width: window.width, height: 80,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
            }}>
                <View style={{
                    flex: 4,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Thumbnail source={dataSource.avatar} style={{ width: 60, height: 60 }} />
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.username}</Text>
                        <Text>{dataSource.nickname}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Button backgroundColor='#4696EC' buttonStyle={{ height: 36, width: 80, borderRadius: 8 }} textStyle={{ fontSize: 15, marginTop: -3 }} title='follow' onPress={() => {
                        console.log('follow ' + dataSource._id);
                    }} />
                </View>
            </View>
        );
    }
}
