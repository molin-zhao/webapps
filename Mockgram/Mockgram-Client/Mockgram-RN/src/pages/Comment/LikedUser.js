import React from 'react';
import { View, Text } from 'react-native';

class LikedUser extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { dataSource } = this.props;
        return (
            <View>
                <Text>Liked User</Text>
            </View>
        );
    }
}

export default LikedUser;