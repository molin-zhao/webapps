import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class You extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>This is You page</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});