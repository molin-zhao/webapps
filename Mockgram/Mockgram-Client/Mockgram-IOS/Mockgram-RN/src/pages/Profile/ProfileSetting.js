import React from 'react';
import { View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Item, Input, Label, Form } from 'native-base';
import { SecureStore, Permissions, ImagePicker } from 'expo';
import processImage from '../../utils/imageProcessing';
import allowPermissions from '../../utils/allowPermissions';
import ActionSheet from 'react-native-actionsheet';
import window from '../../utils/getWindowSize';
import baseUrl from '../../common/baseUrl';

export default class ProfileSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUri: this.props.navigation.getParam('user').avatar,
            nickname: this.props.navigation.getParam('user').nickname,
            bio: this.props.navigation.getParam('user').bio,
            permissionAllowed: false,
            choosedImage: null
        }
    }
    static navigationOptions = ({ navigation }) => ({

        headerLeft: (
            <TouchableOpacity style={{ marginLeft: 20 }}
                onPress={() => {
                    navigation.popToTop();
                }}>
                <Icon name='chevron-left' size={20} />
            </TouchableOpacity>
        )
    })

    componentWillMount() {
        SecureStore.getItemAsync('permission_camera').then(permissionData => {
            if (permissionData) {
                let permissionInfo = JSON.parse(permissionData);
                if (permissionInfo.CAMERA_ROLL && permissionInfo.CAMERA) {
                    this.setState({ permissionAllowed: true });
                }
            }
        })
    }

    choosePhotoFromLibrary = async () => {
        let capturedImage = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!capturedImage.cancelled) {
            let processedImage = await processImage(capturedImage.uri);
            this.setState({
                imageUri: processedImage.uri,
                choosedImage: processedImage,
            })
        }
    }

    choosePhotoFromCamera = async () => {
        let capturedImage = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!capturedImage.cancelled) {
            let processedImage = await processImage(capturedImage.uri);
            this.setState({
                imageUri: processedImage.uri,
                choosedImage: processedImage,
            })
        }
    }
    removeProfileAvatar = () => {
        let formData = new FormData();
        formData.append("id", global.userinfo.user._id);
        fetch(`${baseUrl.upload}/upload/profile/remove/avatar`, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: global.userinfo.token
            }
        }).then(res => res.json()).then(resJson => {
            global.userinfo.user = resJson.user
            this.setState({
                imageUri: '',
                image: null
            });
        })
    }

    uploadProfile = () => {
        console.log(this.state);
        let fileName = this.state.imageUri.split('/').pop();
        let match = /\.(\w+)$/.exec(fileName);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('avatar', {
            uri: this.state.imageUri,
            name: fileName,
            type: type
        });
        formData.append('bio', this.state.bio);
        formData.append('nickname', this.state.nickname);
        formData.append('id', global.userinfo.user._id);
        fetch(`${baseUrl.upload}/upload/profile`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: global.userinfo.token
            },
            body: formData
        }).then(res => res.json()).then(resJson => {
            global.userinfo.user = resJson.user;
            this.props.navigation.goBack();
        })
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    }
    render() {
        const user = this.props.navigation.getParam('user', null);
        return (
            <View style={styles.container}>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'change your profile photo?'}
                    options={['From library', 'Take a photo', 'remove avatar', 'Cancel']}
                    cancelButtonIndex={3}
                    destructiveButtonIndex={2}
                    onPress={(index) => {
                        if (index === 0) {
                            this.choosePhotoFromLibrary();
                        } else if (index === 1) {
                            this.choosePhotoFromCamera();
                        } else if (index === 2) {
                            this.removeProfileAvatar()
                        }
                    }}

                />
                {this.state.imageUri === '' ?
                    <Avatar
                        large
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        activeOpacity={0.7}
                        onPress={this.showActionSheet}
                        containerStyle={{ marginTop: 30 }}
                    /> :
                    <Avatar
                        large
                        rounded
                        onPress={this.showActionSheet}
                        activeOpacity={0.7}
                        containerStyle={{ marginTop: 30 }}
                        source={{ uri: this.state.imageUri }}
                    />
                }
                <View style={styles.profile}>
                    <Form style={{ width: window.width }}>
                        <Item stackedLabel>
                            <Label>nickname</Label>
                            <Input style={{ marginLeft: 5, height: window.width * 0.2 }} placeholder={user.nickname} value={this.state.nickname} onChangeText={text => {
                                this.setState({ nickname: text })
                            }} />
                        </Item>
                        <Item stackedLabel>
                            <Label>bio</Label>
                            <Input style={{ marginLeft: 5, height: window.width * 0.2 }} placeholder={user.bio} value={this.state.bio} onChangeText={text => {
                                this.setState({ bio: text })
                            }} />
                        </Item>
                    </Form>
                    <Button style={{ marginTop: 20, color: '#eb765a', width: window.width * 0.8, heigh: window.width * 0.15 }} title='edit' onPress={() => { this.uploadProfile() }} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    profile: {
        marginTop: 30,
        width: window.width,
        alignItems: 'center'
    }
})