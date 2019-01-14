import React from 'react';
import { Text } from 'react-native';
import { Button } from 'react-native-elements';
import { CardItem, Left, Body, Right, Thumbnail } from 'native-base';
import window from '../utils/getDeviceInfo';
export default class UserListCell extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { dataSource, ...props } = this.props;
        return (<CardItem style={{ borderWidth: 0, width: window.width, height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Left style={{ flex: 4 }}>
                <Thumbnail source={dataSource.avatar === '' ? require('../static/user.png') : {
                    uri: dataSource.avatar
                }} />
                <Body>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.username}</Text>
                    <Text>{dataSource.nickname}</Text>
                </Body>
            </Left>
            <Right style={{ flex: 1 }}>
                <Button backgroundColor='#4696EC' buttonStyle={{ height: 36, width: 80, borderRadius: 8 }} textStyle={{ fontSize: 15, marginTop: -3 }} title='follow' onPress={() => {
                    console.log('follow ' + dataSource._id);
                }} />
            </Right>
        </CardItem>);
    }
}