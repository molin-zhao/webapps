import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
export default class LoginModel extends React.Component {
    loginWithFacebook = () => {
        console.log('facebook');
    }
    render() {
        return (
            <View style={styles.container}>
                <Button
                    icon={{ name: 'facebook-f', type: 'font-awesome', size: 15, color: 'white' }}
                    title="Login with Facebook"
                    onPress={() => this.loginWithFacebook()}
                    buttonStyle={styles.loginBtn}
                />
            </View>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        height: 50,
        width: windowWidth * 0.5,
        backgroundColor: 'blue'
    }
})