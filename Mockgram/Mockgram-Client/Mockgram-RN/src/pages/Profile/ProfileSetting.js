import React from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SecureStore, Permissions, ImagePicker } from 'expo';
import { connect } from 'react-redux';

import processImage from '../../utils/imageProcessing';
import allowPermissions from '../../utils/allowPermissions';
import ActionSheet from 'react-native-actionsheet';
import window from '../../utils/getDeviceInfo';
import baseUrl from '../../common/baseUrl';
import * as LocalKeys from '../../common/localKeys';

class ProfileSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUri: '',
            nickname: '',
            bio: '',
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
        const { profile } = this.props;
        SecureStore.getItemAsync(LocalKeys.PERMISSION_CAMERA).then(permissionData => {
            if (permissionData) {
                let permissionInfo = JSON.parse(permissionData);
                if (permissionInfo.CAMERA_ROLL && permissionInfo.CAMERA) {
                    this.setState({ permissionAllowed: true });
                }
            }
        });
        if (profile) {
            this.setState({
                imageUri: profile.avatar,
            })
        }
    }

    choosePhotoFromLibrary = async () => {
        if (!this.state.permissionAllowed) {
            this.setState({
                permissionAllowed: allowPermissions.allowCameraAccess()
            }, () => {
                if (!this.state.permissionAllowed) {
                    return;
                }
            });
        }
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
        if (!this.state.permissionAllowed) {
            this.setState({
                permissionAllowed: allowPermissions.allowCameraAccess()
            }, () => {
                if (!this.state.permissionAllowed) {
                    return;
                }
            });
        }
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
        const { client } = this.props;
        let formData = new FormData();
        formData.append("id", client.user._id);
        fetch(`${baseUrl.upload}/upload/profile/remove/avatar`, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: client.token
            }
        }).then(res => res.json()).then(resJson => {
            if (resJson.status === 200) {
                this.setState({
                    imageUri: '',
                    choosedImage: null
                });
            } else {
                console.log("remove image error");
            }
        })
    }

    uploadProfile = () => {
        const { client } = this.props;
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
        formData.append('id', client.user._id);
        fetch(`${baseUrl.upload}/upload/profile`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: client.token
            },
            body: formData
        }).then(res => res.json()).then(resJson => {
            this.props.navigation.goBack();
        })
    }

    showActionSheet = () => {
        this.ActionSheet.show();
    }

    render() {
        const { profile } = this.props;
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
                    <View style={{ width: '90%' }}>
                        <View style={styles.itemCol}>
                            <Text>Nickname</Text>
                            <TextInput style={{}}
                                placeholder={profile.nickname}
                                value={this.state.nickname} onChangeText={text => {
                                    this.setState({ nickname: text })
                                }} />
                        </View>
                        <View style={styles.itemCol}>
                            <Text>Bio</Text>
                            <TextInput style={{}}
                                placeholder={profile.bio}
                                value={this.state.bio}
                                onChangeText={text => {
                                    this.setState({ bio: text })
                                }} />
                        </View>
                    </View>
                    <Button style={{ marginTop: 20, color: '#eb765a', width: window.width * 0.8, heigh: window.width * 0.15 }} title='edit' onPress={() => { this.uploadProfile() }} />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        profile: state.profile.profile
    }
}

export default connect(mapStateToProps, null)(ProfileSetting)

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
    },
    itemCol: {
        marginTop: 20,
        height: window.height * 0.05,
        width: '90%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    }
})