import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { SecureStore } from 'expo';
import { Item, Input, Icon, CheckBox, Body } from 'native-base';


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: this.props.navigation.getParam('loginName', ''),
            loginPassword: this.props.navigation.getParam('loginPassword', ''),
            rememberme: this.props.navigation.getParam('rememberme', false),
            loginError: this.props.navigation.getParam('loginError', '')
        }
    }

    componentWillMount() {
        SecureStore.getItemAsync('login_creds').then((userdata) => {
            let userinfo = JSON.parse(userdata);
            if (userinfo) {
                this.setState({ loginName: userinfo.loginName });
                this.setState({ loginPassword: userinfo.loginPassword });
                this.setState({ rememberme: true });
            }
        })
    }


    renderLoginError = () => {
        if (this.state.loginError !== '') {
            return (
                <Text style={styles.loginError}><Icon name='exclamation-circle' type="FontAwesome" style={{ fontSize: 15, color: 'red', marginRight: 5 }} />{this.state.loginError}</Text>
            );
        } else {
            return <Text>{null}</Text>
        }
    }



    handleLogin = async () => {
        console.log(this.state);
        if (this.state.rememberme) {
            await SecureStore.setItemAsync('login_creds', JSON.stringify({
                loginName: this.state.loginName,
                loginPassword: this.state.loginPassword
            })).catch((err) => {
                console.log('Could not save user info', err);
            });
        } else {
            await SecureStore.deleteItemAsync('logincreds').catch(err => console.log('Could not delete user info', err));
        }
        fetch('http://localhost:3031/user/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.loginName,
                password: this.state.loginPassword,
            }),
        }).then(res => res.json()).then(resJson => {
            if (resJson.status === 200) {
                // login success
                let userinfo = {
                    token: resJson.token,
                    user: resJson.user
                }
                SecureStore.setItemAsync('userinfo', JSON.stringify(userinfo)).then(() => {
                    global.userinfo = userinfo;
                })
                // global.socket = SocketIOClient(`${baseUrl.socket}`);
                // global.socket.emit('registerClient', { id: global.userinfo.user._id });
                this.props.navigation.popToTop()
            } else {
                // login failed
                this.setState({
                    loginError: resJson.msg
                })
            }
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <Image style={{ marginTop: 30, width: 100, height: 100, borderRadius: 25 }} source={require('../../static/favicon.png')} />
                <Item style={styles.formInput}>
                    <Icon type='FontAwesome' name='envelope' />
                    <Input placeholder='Email or username'
                        onChangeText={(value) => this.setState({ loginName: value })}
                        value={this.state.loginName} />
                </Item>
                <Item style={styles.formInput}>
                    <Icon type='FontAwesome' name='unlock-alt' />
                    <Input placeholder='Password'
                        onChangeText={(password) => this.setState({ loginPassword: password })}
                        secureTextEntry={true}
                        value={this.state.loginPassword} />
                </Item>
                <this.renderLoginError />
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
    },
    loginError: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap',
        width: windowWidth * 0.7,
        color: 'red',
        fontSize: 15
    },
})