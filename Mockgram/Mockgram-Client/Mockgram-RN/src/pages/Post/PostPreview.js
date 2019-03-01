import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Location, Permissions, SecureStore } from 'expo'
import window from '../../utils/getDeviceInfo';
import baseUrl from '../../common/baseUrl';


export default class PostPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: this.props.navigation.getParam('image', null),
            description: '',
            location: null,
            label: '',
            allowLoation: false,
            switchValue: false
        }
    }
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params = {} } = navigation.state;
        return {
            headerStyle: {
                borderBottomColor: 'transparent',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerRight: (
                <TouchableOpacity style={{ marginRight: 20 }}
                    onPress={() => params.handlePost()}>
                    <Text style={{ color: 'black', fontSize: 15 }}>Post</Text>
                </TouchableOpacity>
            ),
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 20 }}
                    onPress={() => {
                        navigation.popToTop();
                    }}>
                    <Icon name='chevron-left' size={20} />
                </TouchableOpacity>
            )
        }
    }
    componentWillMount() {
        SecureStore.getItemAsync('permission_location').then(permissionData => {
            if (permissionData) {
                let permissionInfo = JSON.parse(permissionData);
                if (permissionInfo.ALLOW_LOCATION) {
                    this.setState({ allowLoation: true });
                }
            }
        });
        this.props.navigation.setParams({ handlePost: this.makePost })
    }

    makePost = () => {
        let fileName = this.state.image.uri.split('/').pop();
        let match = /\.(\w+)$/.exec(fileName);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('post', {
            uri: this.state.image.uri,
            name: fileName,
            type: type
        });
        formData.append('description', this.state.description);
        formData.append('label', this.state.label);
        formData.append('location', JSON.stringify(this.state.location));
        formData.append('id', global.userinfo.user._id);
        fetch(`${baseUrl.upload}/upload/post`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: global.userinfo.token
            },
            body: formData
        }).then(res => res.json()).then(resJson => {
            console.log(resJson);
            this.props.navigation.navigate('Home');
        })
    }

    generateLocation = (coords, address) => {
        return {
            name: address.name,
            country: address.country,
            isoCountryCode: address.isoCountryCode,
            city: address.city,
            region: address.region,
            postalCode: address.postalCode,
            street: address.street,
            coordinates: {
                type: 'Point',
                coords: {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }
            }
        }
    }
    getLocationAsync = async (value) => {
        if (value) {
            // add a location
            if (!this.state.allowLoation) {
                let { status } = await Permissions.askAsync(Permissions.LOCATION);
                if (status === 'granted') {
                    this.setState({
                        allowLoation: true,
                        switchValue: true,
                    })
                    let locationCoords = await Location.getCurrentPositionAsync({});
                    let locationAddress = await Location.reverseGeocodeAsync(locationCoords.coords);
                    let location = this.generateLocation(locationCoords.coords, locationAddress[0]);
                    this.setState({
                        location: location
                    });
                    SecureStore.setItemAsync('permission_location', JSON.stringify({
                        ALLOW_LOCATION: true
                    }))
                } else {
                    this.setState({
                        switchValue: false
                    })
                }
            } else {
                this.setState({ switchValue: true });
                let locationCoords = await Location.getCurrentPositionAsync({});
                let locationAddress = await Location.reverseGeocodeAsync(locationCoords.coords);
                let location = this.generateLocation(locationCoords.coords, locationAddress[0]);
                this.setState({
                    location: location,
                });
            }
        } else {
            // remove location
            this.setState({
                switchValue: false,
                location: null
            })
        }
    }

    render() {
        const image = this.props.navigation.getParam('image', null);
        return (
            <View style={styles.container}>
                <View style={styles.descriptionView}>
                    <Image source={{ uri: image.uri }} style={{ marginLeft: 5, width: window.width * 0.25, height: window.width * 0.25 }} />
                    <TextInput multiline={true}
                        numberOfLines={4}
                        placeholder='Write a description'
                        style={{
                            marginLeft: 20,
                            marginRight: 5,
                            height: window.width * 0.25,
                            width: window.width * 0.65,
                            borderColor: null,
                            borderWidth: 0,
                            backgroundColor: '#fff'
                        }}
                        value={this.state.description}
                        onChangeText={text => {
                            this.setState({ description: text });
                        }} />
                </View>
                <View style={styles.item}>
                    <TextInput
                        placeholder='label'
                        value={this.state.label}
                        onChangeText={text => {
                            this.setState({ label: text })
                        }} />
                </View>
                <TouchableOpacity
                    style={styles.item}
                    activeOpacity={1}
                    onPress={() => {
                        console.log('tag you friends');
                    }}>
                    <Text>Tag Your friends</Text>
                    <Icon name='arrow-right' size={15} style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <View style={styles.item}>
                    <View style={{ width: '10%', height: '70%', justifyContent: 'center', alignItems: 'center' }}>
                        <Switch style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} value={this.state.switchValue}
                            onValueChange={value => {
                                this.getLocationAsync(value);
                            }} />
                    </View>
                    <Text style={{ fontSize: 18 }}>
                        {this.state.switchValue && this.state.location ? this.state.location.city : 'add a place'}
                    </Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    descriptionView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: window.width * 0.3,
        width: '95%',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    item: {
        marginTop: 10,
        height: window.height * 0.05,
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 0.5
    }
});