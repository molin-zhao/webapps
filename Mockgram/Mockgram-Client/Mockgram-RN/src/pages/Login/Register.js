import React from 'react';
import { View, StyleSheet, Dimensions, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import formValidation from '../../utils/formValidation';
import baseUrl from '../../common/baseUrl';
import { SecureStore } from 'expo';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            valid: false,
            errors: {
                username: {
                    status: false,
                    message: ''
                },
                email: {
                    status: false,
                    message: ''
                },
                password: {
                    status: false,
                    message: ''
                },
                confirmPassword: {
                    status: false,
                    message: ''
                },
            },
            registerError: '',
        }
    }
    allTouched() {
        return this.state.username !== '' && this.state.email !== '' && this.state.password !== '' && this.state.confirmPassword !== '';
    }


    renderRegisterError = () => {
        if (this.state.registerError !== '') {
            return (
                <Text style={styles.registerError}><Icon name='exclamation-circle' type="FontAwesome" style={{ fontSize: 15, color: 'red', marginRight: 5 }} />{this.state.registerError}</Text>
            );
        } else {
            return <Text>{null}</Text>
        }
    }

    register() {
        fetch(`${baseUrl.api}/user/register`, {
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
        }).then(res => res.json()).then(resJson => {
            if (resJson.status === 200) {
                // register success
                this.setState({
                    registerError: ''
                });
                this.props.navigation.navigate('Login', {
                    loginName: this.state.username,
                    loginPassword: this.state.password,
                    loginError: '',
                    rememberme: false
                });
            } else {
                // register error
                this.setState({
                    registerError: resJson.msg
                });
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.formInput}>
                    <Icon name='envelope' size={20} />
                    <TextInput
                        style={{ marginLeft: 10, fontSize: 14 }}
                        placeholder='Email'
                        onChangeText={(email) => {
                            this.setState({ email });
                            formValidation(this, this.state.errors.email, 'Email', email, 'isEmail', null);
                        }}
                        value={this.state.email} />
                </View>
                <Text style={styles.formValidationMessage}>{this.state.errors.email.status ? this.state.errors.email.message : null}</Text>
                <View style={styles.formInput}>
                    <Icon name='user' size={20} />
                    <TextInput
                        style={{ marginLeft: 10, fontSize: 14 }}
                        placeholder='Username'
                        onChangeText={(username) => {
                            this.setState({ username });
                            formValidation(this, this.state.errors.username, 'Username', username, 'isAlphanumberic', null);
                        }}
                        value={this.state.username} />
                </View>
                <Text style={styles.formValidationMessage}>{this.state.errors.username.status ? this.state.errors.username.message : null}</Text>
                <View style={styles.formInput}>
                    <Icon name='key' size={20} />
                    <TextInput
                        style={{ marginLeft: 10, fontSize: 14 }}
                        placeholder='Password'
                        onChangeText={(password) => {
                            this.setState({ password });
                            formValidation(this, this.state.errors.password, 'Password', password, 'isPassword', null);
                        }}
                        value={this.state.password}
                        secureTextEntry={true} />
                </View>
                <Text style={styles.formValidationMessage}>{this.state.errors.password.status ? this.state.errors.password.message : null}</Text>
                <View style={styles.formInput}>
                    <Icon name='lock' size={20} />
                    <TextInput
                        style={{ marginLeft: 10, fontSize: 14 }}
                        placeholder='Confirm password'
                        onChangeText={(confirmPassword) => {
                            this.setState({ confirmPassword });
                            formValidation(this, this.state.errors.confirmPassword, 'Confirm password', confirmPassword, 'isConfirmPassword', this.state.password);
                        }}
                        value={this.state.confirmPassword}
                        secureTextEntry={true} />
                </View>
                <Text style={styles.formValidationMessage}>{this.state.errors.confirmPassword.status ? this.state.errors.confirmPassword.message : null}</Text>
                <this.renderRegisterError />
                <Button title='Register'
                    icon={(!this.state.valid || !this.allTouched()) ? { name: 'ban', type: 'font-awesome', size: 18, color: 'white' } : null}
                    disabled={!this.state.valid || !this.allTouched()}
                    onPress={() => this.register()}
                    buttonStyle={styles.loginBtn} />
            </View >
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: windowWidth * 0.7,
        height: 50,
        marginTop: 50
    },
    formButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: windowWidth * 0.6,
        marginTop: 50
    },
    loginBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        height: 50,
        width: windowWidth * 0.5,
        backgroundColor: '#eb765a',
        borderRadius: 10,
    },
    registerError: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap',
        width: windowWidth * 0.7,
        color: 'red',
        fontSize: 15
    },
    formValidationMessage: {
        width: windowWidth * 0.7,
        fontSize: 15,
        color: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        flexWrap: 'wrap'
    }
})