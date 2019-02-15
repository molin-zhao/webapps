import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, CardItem, Thumbnail, Body, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewMoreText from 'react-native-view-more-text';

import { connect } from 'react-redux';

import window from '../utils/getDeviceInfo';
import baseUrl from '../common/baseUrl';
import { dateConverter, numberConverter } from '../utils/unitConverter';
import { addClientProfilePosts, removeClientProfilePost } from '../redux/actions/profileActions';



class PostCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSource,
            navigation: this.props.navigation
        }
    }

    handleLike = () => {
        const { client, addLikePostToProfile, removeLikePostFromProfile } = this.props;
        const { dataSource } = this.state;
        if (client && client.token) {
            const url = `${baseUrl.api}/post/liked`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    Authorization: client.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: client.user._id,
                    postId: dataSource._id,
                    addLike: !dataSource.liked
                })
            }).then(res => res.json()).then(res => {
                if (res.status === 200) {
                    dataSource.likeCount = dataSource.liked ? dataSource.likeCount - 1 : dataSource.likeCount + 1;
                    dataSource.liked = !dataSource.liked;
                    this.setState({
                        dataSource: dataSource
                    }, () => {
                        if (dataSource.creator !== client.user._id) {
                            // client liked other user's post, push this post to local profile
                            if (dataSource.liked) {
                                addLikePostToProfile({ new: [dataSource] });
                            } else {
                                removeLikePostFromProfile(dataSource._id);
                            }
                        }
                    });
                }
            })
        }
    }

    handleComment = () => {
        const { dataSource } = this.state;
        const { navigation } = this.props;
        navigation.navigate('Comment', {
            postId: dataSource._id,
            creatorId: dataSource.creator,
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
        const { dataSource } = this.state;
        if (dataSource.location) {
            return (
                <Body>
                    <Text style={headerStyle}>{dataSource.postUser.username}</Text>
                    <Text>{dataSource.location ? dataSource.location.city : null}</Text>
                </Body>
            );
        } else {
            // if this post is for advertisement, return sponsored
            if (dataSource.ad) {
                return (
                    <Body>
                        <Text>{`Sponsored`}</Text>
                    </Body>
                );
            }
        }
        return (
            <Body>
                <Text style={headerStyle}>{dataSource.postUser.username}</Text>
            </Body>
        );
    }

    render() {
        const { dataSource } = this.state;
        return (
            <Card key={dataSource._id} style={{ width: window.width, marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={dataSource.postUser.avatar === '' ? require('../static/user.png') : {
                            uri: dataSource.postUser.avatar
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
                    <Image source={{ uri: dataSource.image }} style={{ height: window.width, width: window.width, flex: 1 }} resizeMode='cover' />
                </CardItem>
                <CardItem style={{ marginTop: 10, height: 50 }}>
                    <Left style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => { this.handleLike() }}
                            >
                                {dataSource.liked ? <Icon name="ios-heart" style={{ color: 'red', fontSize: 24 }} />
                                    : <Icon name="ios-heart-outline" style={{ color: null, fontSize: 24 }} />
                                }
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{numberConverter(dataSource.likeCount)}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    this.handleComment();
                                }}
                            >
                                <Icon name="ios-chatboxes-outline" style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{numberConverter(dataSource.commentCount)}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onPress={() => {
                                    this.handleShare();
                                }}
                            >
                                <Icon name="ios-open-outline" style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{numberConverter(dataSource.sharedCount)}</Text>
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
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{
                                                marginTop: 2,
                                                height: 15,
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                alignItems: 'flex-start'
                                            }}
                                        >
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
                                    {dataSource.postUser.username}
                                    <Text style={{ fontWeight: 'normal' }}>
                                        {`  ${dataSource.description}`}
                                    </Text>
                                </Text>
                            </ViewMoreText>
                        </View>
                        <View style={{ marginTop: 5, height: 20 }}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{`published ${dateConverter(dataSource.createdAt)}`}</Text>
                        </View>
                    </Body>
                </CardItem>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    client: state.client.client
});

const mapDispatchToProps = dispatch => ({
    addLikePostToProfile: (data) => dispatch(addClientProfilePosts('LIKED', data)),
    removeLikePostFromProfile: (id) => dispatch(removeClientProfilePost('LIKED', id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostCardComponent);

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