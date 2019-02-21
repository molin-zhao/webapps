import React from 'react';
import { Text, Image, View } from 'react-native';

import Thumbnail from './Thumbnail';
import window from '../utils/getDeviceInfo';
import { userAvatar } from '../utils/getUserInfo';



export default class PostListCell extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { dataSource } = this.props;
        return (
            <View style={{
                borderWidth: 0,
                width: window.width,
                height: 80,
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
                    <Thumbnail source={dataSource.postBy} />
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.postBy.nickname}</Text>
                        <Text style={{ fontSize: 13 }}>{`${dataSource.location.street}, ${dataSource.location.city}, ${dataSource.location.region}`}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: dataSource.image }} />
                </View>
            </View>
        );
    }
}