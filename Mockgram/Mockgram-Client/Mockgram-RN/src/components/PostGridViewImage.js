import React from 'react';
import { View, Image } from 'react-native';

import window from '../utils/getDeviceInfo';

export default class PostGridViewImage extends React.Component {


    render() {
        const { numColumns, navigation, dataSource } = this.props;
        return (
            <View style={{ width: window.width / numColumns, height: window.width / numColumns, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: dataSource.image }} style={{ width: '95%', height: '95%' }} />
            </View>
        );
    }
}