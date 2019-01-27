import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
class BadgeIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { color, size, name, auth, navigation, router, client } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.badgeBackground}>
                    <View style={styles.badge}>
                        <Text style={{ color: '#fff', fontSize: 7 }}>99+</Text>
                    </View>
                </View>
                <Icon name={name} color={color} size={size} onPress={() => {
                    if (auth && !client) {
                        navigation.navigate(router.auth);
                    } else {
                        navigation.navigate(router.target);
                    }
                }} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        client: state.client.client,
        message: state.message.message
    }
}

export default connect(mapStateToProps, null)(withNavigation(BadgeIcon));

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeBackground: {
        zIndex: 1,
        position: 'absolute',
        right: -12,
        top: 0,
        width: 21,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',

    },
    badge: {
        zIndex: 2,
        width: '85%',
        height: '85%',
        backgroundColor: 'red',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
