import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class Following extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { client, navigation } = this.props;
        if (client) {

        } else {
            navigation.navigate('Auth');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>This is Following page</Text>
            </View>
        );
    }
}

const mapStateToProps = state => (
    {
        client: state.client.client
    }
);

export default connect(mapStateToProps, null)(Following);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});