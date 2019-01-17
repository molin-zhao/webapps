import React from 'react';
import { Image } from 'react-native';

export default class Thumbnail extends React.Component {
    render() {
        const { style, source } = this.props;
        return (
            <Image style={[style, { borderRadius: style.height / 2 }]} source={source === '' ? require('../static/user.png') : {
                uri: source
            }} />
        );
    }
}