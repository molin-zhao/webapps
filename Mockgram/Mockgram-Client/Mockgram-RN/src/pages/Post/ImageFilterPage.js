import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import window from '../../utils/getDeviceInfo';


export default class ImageFilterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: 0
        }
    }
    static navigationOptions = ({ navigation }) => {
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
                        navigation.navigate('PostPreview', {
                            image: navigation.getParam('image', null)
                        });
                    }}>
                    <Text style={{ color: 'black', fontSize: 15 }}>Next</Text>
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

    applyFilter = () => {
        if (this.state.selectedFilter === 1) {
            return new filters.DotFilter();
        } else if (this.state.selectedFilter === 2) {
            return new filters.BlurFilter();
        } else if (this.state.selectedFilter === 3) {
            return new filters.NoiseFilter();
        } else if (this.state.selectedFilter === 4) {
            let filter = new filters.ColorMatrixFilter();
            filter.vintage(true)
            filter.brightness(0.6);
            return filter;
        }
        return null;
    }

    render() {
        const { navigation } = this.props
        const image = navigation.getParam('image', null);

        return (
            <View style={styles.container}>
                {this.state.selectedFilter === 0 ? <Image style={styles.mainImage} source={{ uri: image.uri }} /> : <Image source={{ uri: image.uri }} resizeMode='cover' style={styles.mainImage} />
                }
                <ScrollView style={styles.filterImages} contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center', paddingStart: 10, paddingEnd: 10 }} showsHorizontalScrollIndicator={false} horizontal={true}>
                    <TouchableOpacity key={0} onPress={() => {
                        this.setState({
                            selectedFilter: 0
                        })
                    }}
                        style={styles.filterImageCell}>
                        <Text>original</Text>
                        <Image source={{ uri: image.uri }} resizeMode='cover' style={{ height: window.width / 4, width: window.width / 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity key={1} onPress={() => {
                        this.setState({
                            selectedFilter: 1
                        })
                    }}
                        style={styles.filterImageCell}>
                        <Text>dot</Text>
                        <Image source={{ uri: image.uri }} resizeMode='cover' style={{ height: window.width / 4, width: window.width / 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity key={2} onPress={() => {
                        this.setState({
                            selectedFilter: 2
                        })
                    }}
                        style={styles.filterImageCell}>
                        <Text>blur</Text>
                        <Image source={{ uri: image.uri }} resizeMode='cover' style={{ height: window.width / 4, width: window.width / 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity key={3} onPress={() => {
                        this.setState({
                            selectedFilter: 3
                        })
                    }}
                        style={styles.filterImageCell}>
                        <Text>noise</Text>
                        <Image source={{ uri: image.uri }} resizeMode='cover' style={{ height: window.width / 4, width: window.width / 4 }} />
                    </TouchableOpacity>
                    <TouchableOpacity key={4} onPress={() => {
                        this.setState({
                            selectedFilter: 4
                        })
                    }}
                        style={styles.filterImageCell}>
                        <Text>color-matrix</Text>
                        <Image source={{ uri: image.uri }} resizeMode='cover' style={{ height: window.width / 4, width: window.width / 4 }} />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    mainImage: {
        width: window.width,
        height: window.width
    },
    filterImages: {
        marginTop: 20
    },
    filterImageCell: {
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})