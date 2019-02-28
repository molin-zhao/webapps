import React from 'react';
import { View, Image } from 'react-native';

import window from '../utils/getDeviceInfo';

export default class PostGridViewImage extends React.Component {


    renderImage = () => {
        const { dataSource } = this.props;
        if (dataSource.type === 'empty') {
            return null;
        }
        return (
            <Image
                source={{ uri: dataSource.image }}
                style={{ width: '95%', height: '95%' }} />
        );
    }


    render() {
        const { numColumns, navigation } = this.props;
        return (
            <View style={{
                width: window.width / numColumns,
                height: window.width / numColumns,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {this.renderImage()}
            </View>
        );
    }
}