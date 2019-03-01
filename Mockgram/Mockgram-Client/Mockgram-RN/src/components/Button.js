import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { BallIndicator } from 'react-native-indicators';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        activeOpacity: 0.8,
        loadingIndicator: () => (<BallIndicator size={14} />),
        iconLeft: () => (null),
        iconRight: () => (null),
        loading: false
    }

    static propTypes = {
        activeOpacity: PropTypes.number,
        loading: PropTypes.bool,

        //styles
        containerStyle: PropTypes.array,
        titleStyle: PropTypes.array,

        //content
        title: PropTypes.string,

        //functions
        iconLeft: PropTypes.func,
        iconRight: PropTypes.func,
        onPress: PropTypes.func,
        loadingIndicator: PropTypes.func
    }

    renderButtonContent = () => {
        const { loading, loadingIndicator, title, titleStyle, iconLeft, iconRight } = this.props;
        if (loading) {
            return (
                loadingIndicator()
            );
        }
        return (
            <View style={{
                width: '100%',
                height: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {iconLeft()}
                <Text style={[{ fontSize: 12 }, titleStyle]}>{title}</Text>
                {iconRight()}
            </View>
        );
    }

    render() {
        const { containerStyle, onPress, activeOpacity } = this.props;
        return (
            <TouchableOpacity
                style={[styles.container, ...containerStyle]}
                onPress={onPress}
                activeOpacity={activeOpacity}
            >
                {this.renderButtonContent()}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
})