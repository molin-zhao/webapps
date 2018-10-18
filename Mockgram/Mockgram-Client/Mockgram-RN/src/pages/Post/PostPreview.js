import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import window from '../../utils/getWindowSize';


export default class PostPreview extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            image: this.props.navigation.getParam('image', null),
            description: '',
            location: null,
            label: ''
        }
    }
    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            headerStyle: {
                borderBottomColor: 'transparent',
                borderBottomWidth: 0,
                shadowColor: 'transparent',
                elevation: 0
            },
            headerRight: (
                <TouchableOpacity style={{ marginRight: 20 }}
                    onPress={() => {
                        console.log('post!!!');
                    }}>
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
    render() {
        const image = this.props.navigation.getParam('image', null);
        return (
            <View style={styles.container}>
                <View style={styles.descriptionView}>
                <Image source={{ uri: image.uri }} style={{ width: window.width * 0.25, height: window.width * 0.25 }} />
                <TextInput 
                value={this.state.description}
                onChangeText={text=>{
                    this.setState({text});
                }}
                style={{width: window.width * 0.65, borderColor: null, borderWidth:0, backgroundColor: '#fff'}}
                multiline={true}
                numberOfLines={4}/>
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
        height: window.width*0.3,
        width: window.width,
    }
});