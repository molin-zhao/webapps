import React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Permissions, ImagePicker, SecureStore } from 'expo';
import processImage from '../../utils/imageProcessing';
import allowPermissions from '../../utils/allowPermissions';

export default class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionAllowed: false,
        }
    }
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

    choosePhotoFromCamera = async () => {
        let capturedImage = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!capturedImage.cancelled) {
            let processedImage = await processImage(capturedImage.uri);
            this.props.navigation.navigate('ImageFilter', {
                image: processedImage
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.permissionAllowed ? <Button title='Take a photo' onPress={() => {
                    this.choosePhotoFromCamera()
                }} /> : <View>
                        <Text>You should allow access to your camera.</Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'blue' }} onPress={() => {
                                this.setState({
                                    permissionAllowed: allowPermissions.allowCameraAccess()
                                })
                            }}>Tap here to allow access</Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});