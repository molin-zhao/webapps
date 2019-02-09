import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import Badge from '../components/Badge';
import { messageCountNormalizer } from '../utils/unitConverter';

class MessageBadgeIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { color, size, name, auth, navigation, router, client, message } = this.props;
        return (
            <View style={styles.container}>
                <Badge val={messageCountNormalizer(message.length)} />
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

const mapStateToProps = (state) => {
    return {
        client: state.client.client,
        message: state.message.message
    }
}

export default connect(mapStateToProps, null)(withNavigation(MessageBadgeIcon));

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
