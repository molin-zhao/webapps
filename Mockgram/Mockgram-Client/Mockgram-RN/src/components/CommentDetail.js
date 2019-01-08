import React from 'react';
import { View, StyleSheet, Text } from 'react-native';


export default class CommentDetail extends React.Component {
    render() {
        const { navigator } = this.props;
        return (
            <View style={styles.container}>
                <View style={{ height: 20, marginTop: 0 }}>
                    <Text onPress={() => {
                        navigator.goBack();
                    }}>This is comment detail page</Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    }
});