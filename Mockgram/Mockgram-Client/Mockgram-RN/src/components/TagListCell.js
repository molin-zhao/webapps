import React from 'react';
import { Text, Image, View } from 'react-native';

import window from '../utils/getDeviceInfo';
import Thumbnail from '../components/Thumbnail';
import { userAvatar } from '../utils/getUserInfo';


export default class TagListCell extends React.Component {
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
                    <View style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Thumbnail source={dataSource.creator.avatar} style={{ width: 50, height: 50 }} />

                    </View>
                    <View style={{
                        width: '80%',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap'
                    }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{dataSource.label}</Text>
                        <Text numberOfLines={2} ellipsizeMode='tail'>{dataSource.description}</Text>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: dataSource.image }} />
                </View>
            </View>);
    }
}