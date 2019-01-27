import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

class AuthIcon extends React.Component {
    render() {
        const { size, name, client, navigation, router, color } = this.props;
        return (
            <Icon name={name} color={color} size={size} onPress={() => {
                if (client) {
                    navigation.navigate(router.target);
                } else {
                    navigation.navigate(router.auth);
                }
            }} />
        );
    }
}

const mapStateToProps = state => {
    return {
        client: state.client.client
    }
}

export default connect(mapStateToProps, null)(withNavigation(AuthIcon));