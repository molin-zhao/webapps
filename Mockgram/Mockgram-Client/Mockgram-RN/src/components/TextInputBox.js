import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Animated, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';

import Thumbnail from '../components/Thumbnail';

import window from '../utils/getDeviceInfo';
import { connect } from 'react-redux';
import { popUpInput, dismissInput, removeMessageReceiver } from '../redux/actions/appActions';
import baseUrl from '../common/baseUrl';
import theme from '../common/theme';

const INPUT_MARGIN = 20;
const ITEM_MARGIN = 10;
const INPUT_OPTION_HEIGHT = window.height * 0.25;
const INPUT_OPTION_DURATION = 100;

class TextInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            textInputHeight: 40 + INPUT_MARGIN * 2 + ITEM_MARGIN * 2,
            textItemHeight: 40 + ITEM_MARGIN * 2,
            textHeight: 40,
            showOptions: false,
            inputPoppedUp: false,
            moreOptionsHeight: new Animated.Value(0)
        }
    }

    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this._keyboardWillShow,
        );
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this._keyboardWillHide,
        );
    }

    componentWillUpdate(nextProps, nextStates) {
        const { inputPoppedUp } = this.state;
        const { popUpInput, dismissInput, inputPoppedUpOutside } = this.props;
        if (!inputPoppedUp && nextStates.inputPoppedUp) {
            popUpInput()
        }

        if (inputPoppedUp && !nextStates.inputPoppedUp) {
            dismissInput()
        }

        if (inputPoppedUpOutside && !nextProps.inputPoppedUpOutside) {
            /**
             * outside update inputPoppedUp from true to false
             * after textinput box received this message, change inputPoppedUp state
             */

            this.setState({
                inputPoppedUp: false
            }, () => {
                this.hideMoreOptions();
            })
        }
    }

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
    }

    _keyboardWillShow = () => {
        /**
         * listener for keyboard pop up and textinput being focused
         */
        const { inputPoppedUp, showOptions } = this.state;
        if (!inputPoppedUp) {
            // become active status
            this.setState({
                inputPoppedUp: true,
            })
        } else {
            if (showOptions) {
                this.hideMoreOptionsWithoutAnimation();
            }
        }
    }

    _keyboardWillHide = () => {
        /**
         * listener for keyboard dismiss and textinput isn't focused
         */
        const { showOptions } = this.state;
        if (!showOptions) {
            this.setState({
                inputPoppedUp: false
            })
        }

    }

    showMoreOptions = () => {
        const { showOptions } = this.state;
        if (!showOptions) {
            this.setState({
                showOptions: true
            }, () => {
                Animated.timing(
                    this.state.moreOptionsHeight,
                    {
                        toValue: INPUT_OPTION_HEIGHT,
                        duration: INPUT_OPTION_DURATION
                    }
                ).start();
            })
        }
    }

    hideMoreOptionsWithoutAnimation = () => {
        const { showOptions } = this.state;
        if (showOptions) {
            this.setState({
                showOptions: false
            }, () => {
                Animated.timing(
                    this.state.moreOptionsHeight,
                    {
                        toValue: 0,
                        duration: 0
                    }
                ).start();
            })
        }
    }

    hideMoreOptions = () => {
        const { showOptions } = this.state;
        if (showOptions) {
            this.setState({
                showOptions: false
            }, () => {
                Animated.timing(
                    this.state.moreOptionsHeight,
                    {
                        toValue: 0,
                        duration: INPUT_OPTION_DURATION
                    }
                ).start();
            })
        }
    }

    updateHeight = (height) => {
        if (height < 82) {
            //approximate 4 lines
            this.setState({
                textHeight: height,
                textInputHeight: height + INPUT_MARGIN * 2 + ITEM_MARGIN * 2,
                textItemHeight: height + ITEM_MARGIN * 2
            });
        }
    }

    handleShowOptions = () => {
        // stick button been pressed
        const { inputPoppedUp, showOptions } = this.state;
        if (inputPoppedUp) {
            if (showOptions) {
                this.hideMoreOptionsWithoutAnimation();
                this._textInput.focus()
            } else {
                Keyboard.dismiss();
                this.showMoreOptions();
            }
        } else {
            this.setState({
                inputPoppedUp: true
            }, () => {
                this.showMoreOptions();
            })
        }
    }

    handleSend = () => {
        const { messageReceiver, client, navigation } = this.props;
        if (!client || !client.token) {
            navigation.navigate('Auth');
        }
        return fetch(`${baseUrl}/`, {

        }).then(res => res.json())
            .then(res => { })
            .then()
            .catch(err => {

            })

    }

    render() {
        const { textInputHeight, textItemHeight, textHeight, inputPoppedUp, showOptions } = this.state;
        const { placeholder, profile, style } = this.props;
        return (
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                <View style={[styles.textInput, { height: textInputHeight }, style]}>
                    <Thumbnail
                        source={profile ? profile.avatar : null}
                        style={{ marginLeft: window.width * 0.05, width: window.width * 0.1, height: window.width * 0.1, borderRadius: window.width * 0.1 / 2 }}
                    />
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 15,
                        borderColor: 'lightgrey',
                        marginLeft: window.width * 0.05,
                        width: window.width * 0.6,
                        height: textItemHeight,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }} >
                        <TextInput
                            placeholderTextColor='lightgrey'
                            ref={o => this._textInput = o}
                            underlineColorAndroid="transparent"
                            style={{ fontSize: 14, width: '90%', marginLeft: window.width * 0.02, height: textHeight }}
                            placeholder={placeholder}
                            onChangeText={(value) => {
                                this.setState({
                                    inputValue: value
                                })
                            }}
                            editable={true}
                            multiline={true}
                            onContentSizeChange={(e) => {
                                this.updateHeight(e.nativeEvent.contentSize.height);
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    //TODO delete logic goes here
                                }
                            }}
                        />
                        <Icon
                            name="ios-send"
                            style={{
                                fontSize:
                                    window.width * 0.05,
                                marginRight: window.width * 0.02,
                                color: theme.primaryBlue
                            }}
                            onPress={() => {
                                this.handleSend()
                            }}
                        />
                    </View>
                    <View style={{
                        height: '100%',
                        marginLeft: window.width * 0.05,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <FontAwesome
                            size={24}
                            name={inputPoppedUp && showOptions ? 'keyboard-o' : 'smile-o'}
                            onPress={() => {
                                this.handleShowOptions();
                            }} />
                    </View>
                </View>
                <Animated.View
                    style={[{ width: '100%', justifyContent: 'center', alignItems: 'center' }, { height: this.state.moreOptionsHeight }]}
                >
                    <Text style={{ color: 'grey', fontSize: 20 }}>Stickers</Text>
                </Animated.View>
            </View>
        );
    }

}

const mapStateToProps = state => ({
    profile: state.profile.profile,
    inputPoppedUpOutside: state.app.inputPoppedUp,
    client: state.client.client,
    messageReceiver: state.app.messageReceiver
})

const mapDispatchToProps = dispatch => ({
    popUpInput: () => dispatch(popUpInput()),
    dismissInput: () => dispatch(dismissInput()),
    removeMessageReceiver: () => dispatch(removeMessageReceiver())
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(TextInputBox));

const styles = StyleSheet.create({
    textInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: window.width,
        backgroundColor: '#fff',
        borderTopWidth: 0.5,
        borderColor: 'lightgrey',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    }
})
