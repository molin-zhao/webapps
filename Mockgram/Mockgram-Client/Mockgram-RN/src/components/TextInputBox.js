import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Thumbnail from '../components/Thumbnail';

import window from '../utils/getDeviceInfo';
import { connect } from 'react-redux';
import { dismissInput, popUpInput } from '../redux/actions/appActions';

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
            focused: false,
            moreOptionsHeight: new Animated.Value(0)
        }
    }

    componentDidUpdate(prevProps) {
        const { inputPoppedUp } = this.props;
        if (prevProps.inputPoppedUp && !inputPoppedUp) {
            // popped up flag from true to false, dismiss textinput box
            this.hideMoreOptions();
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

    componentWillUnmount() {
        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
    }

    _keyboardWillShow = () => {
        /**
         * listener for keyboard pop up and textinput being focused
         */
        const { inputPoppedUp } = this.props;
        if (inputPoppedUp) {
            this.hideMoreOptionsWithoutAnimation();
        }
        this.setState({
            focused: true
        })
    }

    _keyboardWillHide = () => {
        /**
         * listener for keyboard dimiss and textinput isn't focused
         */
        this.setState({
            focused: false
        })
    }

    showMoreOptions = () => {
        this.setState({
            showMoreOptions: true
        }, () => {
            Keyboard.dismiss();
            Animated.timing(
                this.state.moreOptionsHeight,
                {
                    toValue: INPUT_OPTION_HEIGHT,
                    duration: INPUT_OPTION_DURATION
                }
            ).start();
        });
    }

    hideMoreOptionsWithoutAnimation = () => {
        Animated.timing(
            this.state.moreOptionsHeight,
            {
                toValue: 0,
                duration: 0
            }
        ).start()
        this.setState({
            showMoreOptions: false
        })

    }

    hideMoreOptions = () => {
        this.setState({
            showMoreOptions: false
        }, () => {
            Animated.timing(
                this.state.moreOptionsHeight,
                {
                    toValue: 0,
                    duration: INPUT_OPTION_DURATION
                }
            ).start();
        });
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
        const { inputPoppedUp, popUpInput } = this.props;
        if (this.state.focused) {
            /**
             * keyboard already popped up when pressing the button
             * 1. dismiss the keyboard
             * 2. show the option view
             */
            Keyboard.dismiss();
            this.showMoreOptions();
            this.setState({
                focused: false
            })
        } else {
            /**
             * keyboard didn't show up and textinput is not focused when pressing the button
             * 1. check if the textinput box is already popped up
             * 2. if textinput box alreay popped up, that means textinput box is showing options
             *     1) hide the option view without animation
             *     2) pop up keyboard and focus the textinput
             * 3. otherwise the textinput box didn't popped up, should pop up textinput box
             *     1) show to option view
             *     2) update inputPoppedUp value
             */
            if (inputPoppedUp) {
                this.hideMoreOptionsWithoutAnimation();
                this._textInput.focus()
                this.setState({
                    focus: true
                })
            } else {
                this.showMoreOptions();
                popUpInput();
            }
        }
    }

    render() {
        const { textInputHeight, textItemHeight, textHeight, focused } = this.state;
        const { placeholder, profile, style, inputPoppedUp } = this.props;
        let showKeyboardIcon = inputPoppedUp && !focused ;
        return (
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                <View style={[styles.textInput, { height: textInputHeight }, style]}>
                    <Thumbnail
                        source={profile ? profile.avatar : null}
                        style={{ marginLeft: window.width * 0.04, width: window.width * 0.1, height: window.width * 0.1, borderRadius: window.width * 0.1 / 2 }}
                    />
                    <View style={{
                        borderWidth: 1,
                        borderRadius: 15,
                        borderColor: 'lightgrey',
                        marginLeft: window.width * 0.04,
                        width: window.width * 0.6,
                        height: textItemHeight,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }} >
                        <TextInput
                            ref={o => this._textInput = o}
                            underlineColorAndroid="transparent"
                            style={{ fontSize: 17, width: '90%', marginLeft: window.width * 0.02, height: textHeight }}
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
                                    console.log('delete');
                                }
                            }}
                        />
                        <Icon name="ios-send" style={{ fontSize: window.width * 0.05, marginRight: window.width * 0.02, color: "#4696EC" }} />
                    </View>
                    <FontAwesome name={showKeyboardIcon? 'keyboard-o' : 'smile-o'} style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }}
                        onPress={() => {
                            this.handleShowOptions();
                        }} />
                    <Icon name="md-add" style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }}
                        onPress={() => {
                            this.handleShowOptions();
                        }} />
                </View>
                <Animated.View
                    style={[{ width: '100%', justifyContent: 'center', alignItems: 'center' }, { height: this.state.moreOptionsHeight }]}
                >
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'lightgrey' }}></View>
                </Animated.View>
            </View>
        );
    }

}

const mapStateToProps = state => ({
    profile: state.profile.profile,
    inputPoppedUp: state.app.inputPoppedUp
})

const mapDispatchToProps = dispatch => ({
    dismissInput: () => dispatch(dismissInput()),
    popUpInput: () => dispatch(popUpInput())
})

export default connect(mapStateToProps, mapDispatchToProps)(TextInputBox)

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

