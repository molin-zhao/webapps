import React from 'react';
import { View, StyleSheet, TextInput, Keyboard, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Thumbnail from '../components/Thumbnail';

import window from '../utils/getDeviceInfo';
import { connect } from 'react-redux';

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
            showMoreOptions: false,
            moreOptionsHeight: new Animated.Value(0)
        }
    }

    showMoreOptions = () => {
        if (!this.state.showMoreOptions) {
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
    }

    hideMoreOptions = () => {
        if (this.state.showMoreOptions) {
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
        if (this.state.showMoreOptions) {
            return this.hideMoreOptions();
        } else {
            return this.showMoreOptions();
        }
    }

    render() {
        const { textInputHeight, textItemHeight, textHeight } = this.state;
        const { placeholder, profile, style } = this.props;
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
                    <Icon name="md-happy" style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }}
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
    profile: state.profile.profile
})

export default connect(mapStateToProps, null)(TextInputBox)

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

