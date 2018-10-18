import React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { SecureStore, Permissions, ImagePicker } from 'expo';
import processImage from '../../utils/imageProcessing';
import allowPermissions from '../../utils/allowPermissions';


export default class Libray extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionAllowed: false,
        }
    }
    componentWillMount() {
        SecureStore.getItemAsync('permission').then(permissionData => {
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
            this.props.navigation.navigate('ImageFilter', {
                image: processedImage
            });
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.permissionAllowed ?
                    <Button title='Choose a photo' onPress={() => {
                        this.choosePhotoFromLibrary()
                    }} /> :
                    <View>
                        <Text>You should allow access to your Library.</Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'blue' }} onPress={() => {
                                this.setState({
                                    permissionAllowed: allowPermissions.allowCameraAccess()
                                })
                            }}>Tap here to allow access</Text>
                        </TouchableOpacity>
                    </View>
                }
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