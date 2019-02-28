import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';

import MessageListCell from '../../components/MessageListCell';

class You extends React.Component {

    render() {
        const { message, navigation } = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    data={message}
                    renderItem={({ item }) => (
                        <MessageListCell dataSource={item} navigation={navigation} />
                    )}
                    keyExtractor={item => item._id}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        message: state.message.message
    }
}
export default connect(mapStateToProps, null)(You);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});