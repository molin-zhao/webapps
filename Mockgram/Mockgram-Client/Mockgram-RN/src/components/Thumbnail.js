import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

export default class Thumbnail extends React.Component {

    static defaultProps = {
        style: { width: 50, height: 50 },
        source: ''
    }

    static propTypes = {
        style: PropTypes.object,
        source: PropTypes.string
    }

    render() {
        const { style, source } = this.props;
        return (
            <Image
                style={[style, { borderRadius: style.height / 2 }]}
                source={source ? { uri: source } : require('../static/user.png')}
                resizeMode='cover'
            />
        );
    }
};

