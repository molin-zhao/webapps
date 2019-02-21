import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, TextInput } from 'react-native';
import { SecureStore } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';

import window from '../../utils/getDeviceInfo';
import * as LocalKeys from '../../common/localKeys';
import { clientLogin, loginError } from '../../redux/actions/clientActions';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: '',
            loginPassword: '',
            rememberMe: false
        }
    }

    componentWillMount() {
        SecureStore.getItemAsync(LocalKeys.LOGIN_CREDENTIALS).then((data) => {
            let creds = JSON.parse(data);
            if (creds) {
                this.setState({
                    loginName: creds.loginName,
                    loginPassword: creds.loginPassword,
                    rememberMe: true
                });
            }
        })
    }


    renderLoginError = (error) => {
        if (error) {
            return (
                <Text style={styles.loginError}><Icon name='exclamation-circle' type="FontAwesome" style={{ fontSize: 15, color: 'red', marginRight: 5 }} />{`  ${error}`}</Text>
            );
        }
        return null;
    }


    handleLogin = async () => {
        const { navigation } = this.props;
        let loginForm = {
            loginName: this.state.loginName,
            loginPassword: this.state.loginPassword,
        }
        if (this.state.rememberMe) {
            await SecureStore.setItemAsync(LocalKeys.LOGIN_CREDENTIALS, JSON.stringify({
                loginName: loginForm.loginName,
                loginPassword: loginForm.loginPassword
            })).catch((err) => {
                console.log('Could not save credential info on local storage', err);
            });
        } else {
            await SecureStore.deleteItemAsync(LocalKeys.LOGIN_CREDENTIALS).catch(err => {
                console.log('Could not delete credential info on local storage', err)
            });
        }
        // client login and set client info into local storage after modifying state
        this.props.clientLogin(loginForm).then((clientInfo) => {
            SecureStore.setItemAsync(LocalKeys.CLIENT_INFO, JSON.stringify(clientInfo)).then(() => {
                navigation.dismiss();
            })
        }).catch((err) => {
            console.log("Cannot set client info in local storage", err);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={{ marginTop: 30, width: 100, height: 100, borderRadius: 25 }} source={require('../../static/favicon.png')} />
                <View style={styles.formInput}>
                    <Icon name='user' size={20} />
                    <TextInput
                        style={{ marginLeft: 10, fontSize: 14 }}
                        placeholder='Email or username'
                        onChangeText={(value) => this.setState({ loginName: value })}
                        value={this.state.loginName} />
                </View>
                <View style={styles.formInput}>
                    <Icon name='unlock-alt' size={20} />
                    <TextInput
                        style={{ marginLeft: 10, fontSize: 14 }}
                        placeholder='Password'
                        onChangeText={(password) => this.setState({ loginPassword: password })}
                        secureTextEntry={true}
                        value={this.state.loginPassword} />
                </View>
                {this.renderLoginError(this.props.errMsg)}
                <TouchableOpacity onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}>
                    <View style={styles.formCheckbox}>
                        <CheckBox
                            containerStyle={{
                                backgroundColor: null,
                                borderWidth: 0
                            }}
                            center
                            title='Remember me'
                            checked={this.state.rememberMe}
                            onPress={() => {
                                this.setState({
                                    rememberMe: !this.state.rememberMe
                                })
                            }}
                        />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    formInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: window.width * 0.7,
        height: 50,
        marginTop: 50
    },
    formCheckbox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: window.width / 2.5,
        height: 50,
        backgroundColor: null,
        marginTop: 50
    },
    formButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: window.width * 0.6,
        marginTop: 50
    },
    loginError: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap',
        width: window.width * 0.7,
        color: 'red',
        fontSize: 15
    },
})

const mapStateToProps = state => {
    return {
        client: state.client.client,
        errMsg: state.client.errMsg
    }
}

const mapDispatchToProps = dispatch => ({
    clientLogin: (loginForm) => dispatch(clientLogin(loginForm)),
    loginError: (err) => dispatch(loginError(err))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
