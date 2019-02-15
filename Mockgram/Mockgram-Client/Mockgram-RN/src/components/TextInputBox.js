import React from 'react';
import { View, StyleSheet, TextInput, Keyboard } from 'react-native';
import { Thumbnail, Item, } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';

import { userAvatar } from '../utils/getUserInfo';
import window from '../utils/getDeviceInfo';
import { connect } from 'react-redux';

let inputMargin = 20;
let itemMargin = 10;
class TextInputBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            textInputHeight: 40 + inputMargin * 2 + itemMargin * 2,
            textItemHeight: 40 + itemMargin * 2,
            textHeight: 40
        }
    }

    updateHeight = (height) => {
        if (height < 82) {
            //approximate 4 lines
            this.setState({
                textHeight: height,
                textInputHeight: height + inputMargin * 2 + itemMargin * 2,
                textItemHeight: height + itemMargin * 2
            });
        }
    }

    render() {
        const { textInputHeight, textItemHeight, textHeight } = this.state;
        const { placeholder, profile } = this.props;
        return (
            <View>
                <View style={[styles.textInput, { height: textInputHeight }, { ...this.props.style }]}>
                    <Thumbnail
                        source={userAvatar(profile)}
                        style={{ marginLeft: window.width * 0.04, width: window.width * 0.1, height: window.width * 0.1, borderRadius: window.width * 0.1 / 2 }}
                    />
                    <Item rounded style={{ marginLeft: window.width * 0.04, width: window.width * 0.6, height: textItemHeight }} >
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
                        />
                        <Icon name="ios-send" style={{ fontSize: window.width * 0.05, marginRight: window.width * 0.02, color: "#4696EC" }} />
                    </Item>
                    <Icon name="md-happy" style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }} onPress={()=>{
                        console.log('stickers');
                    }}/>
                    <Icon name="md-add" style={{ fontSize: window.width * 0.05, marginLeft: window.width * 0.04 }} onPress={() => {
                        console.log("add");
                    }} />
                </View>
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
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    }
})

