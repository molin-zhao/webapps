import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Thumbnail, Item, Input } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { getUserAvatar } from '../utils/getUserInfo';
import window from '../utils/getWindowSize';

export default class TextInputBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let avatar = getUserAvatar();
        return (
            <View style={[styles.textInput, { ...this.props.style }]} behavior="padding">
                <Thumbnail source={avatar === '' ? require('../static/user.png') : {
                    uri: avatar
                }} style={{ marginLeft: window.width * 0.04, width: window.width * 0.1, height: window.width * 0.1 }} />
                <Item rounded style={{ marginLeft: window.width * 0.04, width: window.width * 0.6, height: "60%" }} >
                    <Input />
                    <Icon name="ios-send" style={{ fontSize: window.width * 0.05, marginRight: window.width * 0.02, color: "#4696EC" }} />
                </Item>
                <Icon name="md-happy" style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }} />
                <Icon name="md-add" style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }} onPress={() => {
                    console.log("add");
                }} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    textInput: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: window.height * 0.1,
        width: window.width,
        backgroundColor: '#fff',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    }
})

