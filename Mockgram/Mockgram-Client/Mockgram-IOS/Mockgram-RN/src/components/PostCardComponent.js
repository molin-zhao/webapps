import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right, Icon } from 'native-base';
import window from '../utils/getWindowSize';
export default class PostCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSource
        }
    }

    render() {
        return (
            <Card key={this.state.dataSource._id} style={{ width: window.width, marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 5 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={this.state.dataSource.postBy.avatar === '' ? require('../static/user.png') : {
                            uri: this.state.date
                                .postBy.avatar
                        }} />
                        <Body>
                            <Text>{this.state.dataSource.postBy.username}</Text>
                            <Text>{this.state.dataSource.location.city}</Text>
                        </Body>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{ uri: this.state.dataSource.image }} style={{ height: windowWidth, width: windowWidth, flex: 1 }} resizeMode='cover' />
                </CardItem>
                <CardItem style={{ marginTop: 10, height: 50 }}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="md-heart-outline" type='Ionicons' style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 10 }}>{this.state.dataSource.likes}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="comment" type="EvilIcons" style={{ marginTop: -2, fontSize: 27 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 10 }}>{this.state.dataSource.comments.length}</Text>
                        </View>
                        {/* <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ height: 25, alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name="md-share-alt" type="Ionicons" style={{ fontSize: 25 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 10 }}></Text>
                        </View> */}
                    </Left>
                </CardItem>
                <CardItem style={{ height: 40 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{this.state.dataSource.likes} likes</Text>
                </CardItem>
                <CardItem style={{ height: 100 }}>
                    <Body>
                        <Text>
                            <Text style={{ fontWeight: "bold" }}>
                                {this.state.dataSource.postBy.username}
                            </Text>
                            {this.state.dataSource.description}
                        </Text>
                    </Body>
                </CardItem>
            </Card>
        );
    }
}
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardLabels: {
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});