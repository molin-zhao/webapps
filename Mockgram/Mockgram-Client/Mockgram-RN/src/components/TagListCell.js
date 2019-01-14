import React from 'react';
import { Text, Image } from 'react-native';
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
                <Thumbnail source={dataSource.postBy.avatar === '' ? require('../static/user.png') : {
                    uri: dataSource.postBy.avatar
                }} />
                <Body>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.label}</Text>
                    <Text>{dataSource.description}</Text>
                </Body>
            </Left>
            <Right style={{ flex: 1 }}>
                {/* <Icon name='arrow-right' size={15} style={{ marginRight: 10 }} /> */}
                <Image style={{ width: 50, height: 50 }} source={{ uri: dataSource.image }} />
            </Right>
        </CardItem>);
    }
}