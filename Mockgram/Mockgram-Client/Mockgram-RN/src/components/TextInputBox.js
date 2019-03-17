import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Animated, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation';
import { PacmanIndicator, UIActivityIndicator } from 'react-native-indicators';
import ActionSheet from 'react-native-actionsheet';
import PropTypes from 'prop-types';

import Thumbnail from '../components/Thumbnail';

import window from '../utils/getDeviceInfo';
import { connect } from 'react-redux';
import baseUrl from '../common/baseUrl';
import theme from '../common/theme';
import { isEqual } from '../utils/idParser';

const INPUT_MARGIN = 20;
const ITEM_MARGIN = 10;
const INPUT_OPTION_HEIGHT = window.height * 0.25;
const INPUT_OPTION_DURATION = 100;
const initMessageReceiver = {
    _id: '',
    useranme: '',
    commentId: '',
    postId: '',
    type: 'comment',
    dataCallbackController: null
}

class TextInputBox extends React.Component {

    static defaultProps = {
        defaultMessageReceiver: initMessageReceiver
    }

    static propTypes = {
        defaultMessageReceiver: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            textInputHeight: 40 + INPUT_MARGIN * 2 + ITEM_MARGIN * 2,
            textItemHeight: 40 + ITEM_MARGIN * 2,
            textHeight: 40,
            moreOptionsHeight: new Animated.Value(0),
            sending: false,
            showOptions: false,
            inputPoppedUp: false,
            keyboardPoppedUp: false,
            currentMessageReceiver: this.props.defaultMessageReceiver,
            updateMessageReceiver: this.props.defaultMessageReceiver,
            mentioned: []
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

    componentDidUpdate(prevProps, prevStates) {
        const { updateMessageReceiver, currentMessageReceiver } = this.state;
        const { defaultMessageReceiver } = this.props;
        if (!isEqual(updateMessageReceiver, prevStates.updateMessageReceiver)) {
            // outside updated updateMessageReceiver has been changed
            console.log('changed');
            if (isEqual(defaultMessageReceiver, currentMessageReceiver)) {
                this._updateCurrentReceiver(updateMessageReceiver);
            } else {
                this.ActionSheet.show();
            }
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
        this.setState({
            keyboardPoppedUp: true
        }, () => {
            if (!inputPoppedUp) {
                // become active status
                this.setState({
                    inputPoppedUp: true,
                })
            } else {
                if (showOptions) {
                    this._hideMoreOptionsWithoutAnimation();
                }
            }
        })
    }

    _keyboardWillHide = () => {
        /**
         * listener for keyboard dismiss and textinput isn't focused
         */
        const { showOptions } = this.state;
        this.setState({
            keyboardPoppedUp: false
        }, () => {
            if (!showOptions) {
                this.setState({
                    inputPoppedUp: false
                })
            }
        })
    }
    _showMoreOptions = () => {
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

    _hideMoreOptionsWithoutAnimation = () => {
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

    _hideMoreOptions = () => {
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

    _updateHeight = (height) => {
        if (height < 82) {
            //approximate 4 lines
            this.setState({
                textHeight: height,
                textInputHeight: height + INPUT_MARGIN * 2 + ITEM_MARGIN * 2,
                textItemHeight: height + ITEM_MARGIN * 2
            });
        }
    }

    _handleShowOptions = () => {
        // sticker button been pressed
        const { inputPoppedUp, showOptions } = this.state;
        if (inputPoppedUp) {
            if (showOptions) {
                // sticker is showing 
                this._hideMoreOptionsWithoutAnimation();
                this._textInput.focus()
            } else {
                // keyboard is showing
                Keyboard.dismiss();
                this._showMoreOptions();
            }
        } else {
            // input is not popped up
            this.setState({
                inputPoppedUp: true
            }, () => {
                this._showMoreOptions();
            })
        }
    }

    _handleSend = () => {
        const { client, navigation, defaultMessageReceiver } = this.props;
        const { currentMessageReceiver } = this.state;
        if (client && client.token) {
            const url = currentMessageReceiver.type === 'comment' ?
                `${baseUrl.api}/post/comment`
                : `${baseUrl.api}/post/comment/reply`;
            const body = currentMessageReceiver.type === 'reply' ?
                {
                    commentId: currentMessageReceiver.commentId,
                    content: this.state.inputValue,
                    to: currentMessageReceiver._id,
                    mentioned: this.state.mentioned
                }
                : {
                    content: this.state.inputValue,
                    postId: currentMessageReceiver.postId,
                    mentioned: this.state.mentioned
                };
            this.setState({
                sending: true
            }, () => {
                return fetch(url, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        Authorization: client.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }).then(res => res.json()).then(res => {
                    if (currentMessageReceiver.dataCallbackController) {
                        currentMessageReceiver.dataCallbackController.setState({
                            data: currentMessageReceiver.dataCallbackController.state.data.concat(res.data),
                            error: res.status === 200 ? null : res.msg
                        })
                    }
                }).then(() => {
                    this.setState({
                        sending: false
                    }, () => {
                        this._clear();
                        this._updateCurrentReceiver(defaultMessageReceiver);
                        this.dismiss();
                    })
                }).catch(err => {
                    console.log(err);
                    this.setState({
                        sending: false
                    })
                })
            })
        } else {
            navigation.navigate('Auth')
        }
    }

    _clear = () => {
        this._textInput.clear();
        this.setState({
            inputValue: ''
        });
    }

    _updateCurrentReceiver = receiver => {
        const { defaultMessageReceiver } = this.props;
        if (isEqual(receiver, defaultMessageReceiver)) {
            this.setState({
                currentMessageReceiver: defaultMessageReceiver,
                updateMessageReceiver: defaultMessageReceiver
            })
        } else {
            this.setState({
                currentMessageReceiver: receiver
            }, () => {
                this._textInput.focus();
            })
        }
    }

    _renderReplyIndicator = () => {
        const { inputPoppedUp, currentMessageReceiver } = this.state;
        const { defaultMessageReceiver } = this.props;
        if (currentMessageReceiver._id && currentMessageReceiver.type === 'reply' && inputPoppedUp) {
            return (
                <View style={styles.replyIndicator}>
                    <View style={{
                        width: '15%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <PacmanIndicator size={window.height * 0.03} />
                    </View>
                    <Text style={{ fontSize: 14, color: 'grey' }}>`repling to `</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.primaryBlue }}>{`${currentMessageReceiver.username}`}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this._clear();
                            this._updateCurrentReceiver(defaultMessageReceiver);
                            this.dismiss();
                        }}
                        style={{
                            width: '15%',
                            height: '100%',
                            position: 'absolute',
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Icon name="md-close" size={window.height * 0.025} />
                    </TouchableOpacity>
                </View>
            )
        }
        return null;
    }

    _renderPlaceHolder = () => {
        const { defaultMessageReceiver } = this.props;
        const { currentMessageReceiver } = this.state;
        if (currentMessageReceiver._id && currentMessageReceiver.type === 'reply') {
            return `@${currentMessageReceiver.username}`;
        } else {
            if (defaultMessageReceiver.type === 'comment') {
                return 'Add a comment...';
            } else {
                return `@${defaultMessageReceiver.username}`;
            }
        }
    }

    _renderSendButton = () => {
        if (!this.state.sending) {
            return (
                <TouchableOpacity
                    style={{
                        width: '10%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        this._handleSend()
                    }}
                >
                    <Icon
                        name="ios-send"
                        color={theme.primaryBlue}
                        size={window.width * 0.05}
                    />
                </TouchableOpacity>
            );
        }
        return (
            <View style={{
                width: '10%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <UIActivityIndicator size={window.width * 0.05} color={theme.primaryBlue} />
            </View>
        );
    }

    render() {
        const {
            textInputHeight,
            textItemHeight,
            textHeight,
            inputPoppedUp,
            showOptions,
            currentMessageReceiver,
            updateMessageReceiver
        } = this.state;
        const { profile, style } = this.props;
        return (
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                {this._renderReplyIndicator()}
                <View style={[styles.textInput, { height: textInputHeight }, style]}>
                    <Thumbnail
                        source={profile ? profile.avatar : null}
                        style={{ marginLeft: window.width * 0.05, width: window.width * 0.1, height: window.width * 0.1, borderRadius: window.width * 0.1 / 2 }}
                    />
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 15,
                        borderColor: theme.primaryGrey,
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
                            style={{ fontSize: 14, width: '85%', marginLeft: window.width * 0.02, height: textHeight }}
                            placeholder={this._renderPlaceHolder()}
                            onChangeText={value => {
                                this.setState({
                                    inputValue: value
                                })
                            }}
                            editable={true}
                            multiline={true}
                            onContentSizeChange={(e) => {
                                this._updateHeight(e.nativeEvent.contentSize.height);
                            }}
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace') {
                                    //TODO delete logic goes here
                                }
                            }}
                            value={this.state.inputValue}
                        />
                        {this._renderSendButton()}
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
                                this._handleShowOptions();
                            }} />
                    </View>
                </View>
                <Animated.View
                    style={[{ width: '100%', justifyContent: 'center', alignItems: 'center' }, { height: this.state.moreOptionsHeight }]}
                >
                    <Text style={{ color: 'grey', fontSize: 20 }}>Stickers</Text>
                </Animated.View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={`Discard editing`}
                    message={`Discard repling to ${currentMessageReceiver.username} and @${updateMessageReceiver.username} ? `}
                    options={['Confirm', 'Cancel']}
                    cancelButtonIndex={1}
                    onPress={index => {
                        if (index === 0) {
                            // confirm to change reply user
                            this._updateCurrentReceiver(updateMessageReceiver);
                        }
                    }}
                />
            </View>
        );
    }

    /**
     * public methods
     */

    dismiss = () => {
        const { inputPoppedUp, keyboardPoppedUp, showOptions } = this.state;
        if (inputPoppedUp) {
            if (keyboardPoppedUp) {
                Keyboard.dismiss();
            }
            if (showOptions) {
                this.setState({
                    inputPoppedUp: false
                }, () => {
                    this._hideMoreOptions();
                })
            }
        }
    }

    updateMessageReceiver = receiver => {
        const { updateMessageReceiver } = this.state;
        if (isEqual(receiver, updateMessageReceiver)) {
            this._textInput.focus();
        } else {
            this.setState({
                updateMessageReceiver: receiver
            })
        }
    }
}

const mapStateToProps = state => ({
    profile: state.profile.profile,
    client: state.client.client,
})

export default connect(mapStateToProps, null)(withNavigation(TextInputBox));

const styles = StyleSheet.create({
    textInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: window.width,
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: 'lightgrey',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    replyIndicator: {
        position: 'absolute',
        top: -40,
        zIndex: 1,
        backgroundColor: theme.primaryGrey,
        height: window.height * 0.035,
        width: window.width * 0.98,
        borderRadius: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    }
})
