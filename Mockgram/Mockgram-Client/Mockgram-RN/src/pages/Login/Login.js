import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { SecureStore } from 'expo';
import { Item, Input, Icon, CheckBox, Body } from 'native-base';


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            rememberme: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo').then((userdata) => {
            let userinfo = JSON.parse(userdata);
            console.log(userinfo);
            if (userinfo) {
                this.setState({ email: userinfo.email });
                this.setState({ password: userinfo.password });
                this.setState({ rememberme: true });
            }
        })
    }
    handleLogin = async () => {
        console.log(this.state);
        if (this.state.rememberme) {
            await SecureStore.setItemAsync('userinfo', JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })).catch((err) => {
                console.log('Could not save user info', err);
            });
        } else {
            await SecureStore.deleteItemAsync('userinfo').catch(err => console.log('Could not delete user info', err));
        }
        fetch('http://localhost:3031/user/auth/auth/local', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            }),
        }).then(res => res.json()).then(resJson => console.log(resJson));
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={{ marginTop: 30, width: 100, height: 100, borderRadius: 25 }} source={require('../../static/favicon.png')} />
                <Item style={styles.formInput}>
                    <Icon type='FontAwesome' name='envelope' />
                    <Input placeholder='Email'
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email} />
                </Item>
                <Item style={styles.formInput}>
                    <Icon type='FontAwesome' name='unlock-alt' />
                    <Input placeholder='Password'
                        onChangeText={(password) => this.setState({ password })}
                        secureTextEntry={true}
                        value={this.state.password} />
                </Item>
                <TouchableOpacity onPress={() => this.setState({ rememberme: !this.state.rememberme })}>
                    <View style={styles.formCheckbox}>
                        <CheckBox checked={this.state.rememberme} />
                        <Body>
                            <Text>Remember me</Text>
                        </Body>
                    </View>
                </TouchableOpacity>
                <View style={styles.formButton}>
                    <Text style={{ fontSize: 18, backgroundColor: null, color: '#eb765a' }} onPress={() => this.handleLogin()}>Login</Text>
                </View>
                <View style={styles.formButton}>
                    <Text style={{ fontSize: 18, backgroundColor: null, color: '#eb765a' }} onPress={() => this.props.navigation.navigate('LoginMode')}>Change login mode</Text>
                    <Text style={{ fontSize: 20, marginLeft: 5, marginRight: 5 }}>|</Text>
                    <Text style={{ fontSize: 18, backgroundColor: null, color: '#eb765a' }} onPress={() => this.props.navigation.navigate('Register')}>Register</Text>
                </View>
            </View>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    formInput: {
        width: windowWidth * 0.7,
        height: 50,
        marginTop: 50
    },
    formCheckbox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth / 2.5,
        height: 50,
        backgroundColor: null,
        marginTop: 50
    },
    formButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.6,
        marginTop: 50
    }
})