import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewMoreText from 'react-native-view-more-text';
import window from '../utils/getDeviceInfo';
import { dateConverter } from '../utils/unitConverter';

export default class PostCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            dataSource: this.props.dataSource,
            liked: false,
            showComments: false,
            descriptionShowLess: true
        }
    }

    handleLike = () => {
        this.setState({
            liked: !this.state.liked
        }, () => {
            console.log(this.state.liked ? 'liked' : 'unliked');
        });
    }

    showModal = () => {
        if (!this.state.showComments) {
            this.setState({
                showComments: !this.state.showComments
            })
        }
    }

    hideModal = () => {
        if (this.state.showComments) {
            this.setState({
                showComments: !this.state.showComments
            })
        }
    }

    handleComment = () => {
        // this.showModal();
        this.props.navigation.navigate('Comment', {
            parent: this,
            postId: this.state.dataSource._id,
            creatorId: this.state.dataSource.postUser._id
        });
    }

    handleShare = () => {
        console.log("share");
    }

    handleMoreOptions = () => {
        console.log("more options");
    }

    renderHeader = () => {
        const headerStyle = { fontWeight: 'bold' }
        if (this.state.dataSource.location) {
            return (<Body>
                <Text style={headerStyle}>{this.state.dataSource.postUser.username}</Text>
                <Text>{this.state.dataSource.location ? this.state.dataSource.location.city : null}</Text>
            </Body>);
        } else {
            // if this post is for advertisement, return sponsored
            if (this.state.dataSource.ad) {
                return (<Body>
                    <Text>{`Sponsored`}</Text>
                </Body>);
            }
        }
        return (<Body>
            <Text style={headerStyle}>{this.state.dataSource.postUser.username}</Text>
        </Body>);
    }

    render() {
        return (
            <Card key={this.state.dataSource._id} style={{ width: window.width, marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={this.state.dataSource.postUser.avatar === '' ? require('../static/user.png') : {
                            uri: this.state.dataSource.postUser.avatar
                        }} />
                        <this.renderHeader />
                    </Left>
                    <Right>
                        <Icon name="md-more" style={{ fontSize: 20 }} onPress={() => {
                            this.handleMoreOptions();
                        }} />
                    </Right>
                </CardItem>
                <CardItem cardBody>
                    <Image source={{ uri: this.state.dataSource.image }} style={{ height: window.width, width: window.width, flex: 1 }} resizeMode='cover' />
                </CardItem>
                <CardItem style={{ marginTop: 10, height: 50 }}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.cardLabels}>
                            {this.state.liked ? <Icon onPress={() => { this.handleLike() }} name="ios-heart" style={{ color: 'red', fontSize: 24 }} />
                                : <Icon onPress={() => { this.handleLike() }} name="ios-heart-outline" style={{ color: null, fontSize: 24 }} />
                            }
                            <Text style={{ fontSize: 12 }}>{this.state.liked ? this.state.dataSource.likeCount + 1 : this.state.dataSource.likeCount}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                this.handleComment();
                            }}>
                                <Icon name="ios-chatboxes-outline" style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{this.state.dataSource.commentCount}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                this.handleShare();
                            }}>
                                <Icon name="ios-open-outline" style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{this.state.dataSource.sharedCount}</Text>
                        </View>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <View>
                            <ViewMoreText
                                numberOfLines={2}
                                renderViewMore={(onPress) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: '#4696EC' }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>
                                        </TouchableOpacity>);

                                }}
                                renderViewLess={(onPress) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: '#4696EC' }}>{`show less `}<Icon name="md-arrow-dropup" /></Text>
                                        </TouchableOpacity>);
                                }}
                            >
                                <Text style={{ fontWeight: "bold" }}>
                                    {this.state.dataSource.postUser.username}
                                    <Text style={{ fontWeight: 'normal' }}>
                                        {`  ${this.state.dataSource.description}`}
                                    </Text>
                                </Text>
                            </ViewMoreText>
                        </View>
                        <View style={{ marginTop: 5, height: 20 }}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{`published ${dateConverter(this.state.dataSource.createdAt)}`}</Text>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardLabels: {
        marginRight: 15,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});