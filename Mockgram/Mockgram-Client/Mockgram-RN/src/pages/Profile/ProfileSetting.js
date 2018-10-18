import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ProfileSetting extends React.Component {
    render() {
        return (
            <View style={styles.ProfileSetting}>
                <Text>This is Profile Setting page</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})