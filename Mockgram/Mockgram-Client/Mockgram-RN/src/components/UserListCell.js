import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Thumbnail from './Thumbnail';
import window from '../utils/getDeviceInfo';
import theme from '../common/theme';

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
                    flex: 3,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Thumbnail source={dataSource.avatar} style={{ width: 50, height: 50 }} />

                    </View>
                    <View style={{
                        width: '80%',
                        justifyContent: 'center',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.username}</Text>
                        <Text>{dataSource.nickname}</Text>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Button backgroundColor={theme.primaryColor} buttonStyle={{ height: 36, width: 80, borderRadius: 8 }} textStyle={{ fontSize: 15, marginTop: -3 }} title='follow' onPress={() => {
                        console.log('follow ' + dataSource._id);
                    }} />
                </View>
            </View>
        );
    }
}
