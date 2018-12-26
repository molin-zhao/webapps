import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class BadgeIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { tintColor, size, name } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.badgeBackground}>
                    <View style={styles.badge}>
                        <Text style={{ color: '#fff', fontSize: 7 }}>99+</Text>
                    </View>
                </View>
                <Icon name={name} tintColor={tintColor} size={size} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeBackground: {
        zIndex: 1,
        position: 'absolute',
        right: -12,
        top: -2,
        width: 22,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',

    },
    badge: {
        zIndex: 2,
        width: '80%',
        height: '80%',
        backgroundColor: 'red',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});