import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import Badge from '../components/Badge';
import { messageCountNormalizer } from '../utils/unitConverter';
import { getNewMessageCount } from '../utils/arrayEditor';

class MessageBadgeIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { color, size, name, auth, navigation, router, client, message, lastMessageId } = this.props;
        return (
            <View style={styles.container}>
                <Badge val={messageCountNormalizer(getNewMessageCount(message, lastMessageId))} />
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
        message: state.message.message,
        lastMessageId: state.message.lastMessageId
    }
}

export default connect(mapStateToProps, null)(withNavigation(MessageBadgeIcon));

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
