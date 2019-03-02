import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewMoreText from 'react-native-view-more-text';
import Thumbnail from './Thumbnail';

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import window from '../utils/getDeviceInfo';
import baseUrl from '../common/baseUrl';
import { dateConverter, numberConverter } from '../utils/unitConverter';
import { addClientProfilePosts, removeClientProfilePost } from '../redux/actions/profileActions';

export class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.card, this.props.style]}>
                {this.props.children}
            </View>
        )
    }
}

export class CardItemRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.cardItemRow, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

export class CardItemCol extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.cardItemCol, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

export class CardBody extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.cardBody, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

export class Left extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.left, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

export class Right extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.right, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

class PostCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSource,
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
                <View style={{
                    marginLeft: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={headerStyle}>{dataSource.postUser.username}</Text>
                    <Text>{dataSource.location ? dataSource.location.city : null}</Text>
                </View>
            );
        } else {
            // if this post is for advertisement, return sponsored
            if (dataSource.ad) {
                return (
                    <View style={{
                        marginLeft: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>{`Sponsored`}</Text>
                    </View>
                );
            }
        }
        return (
            <View style={{
                marginLeft: 10,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={headerStyle}>{dataSource.postUser.username}</Text>
            </View>
        );
    }

    /**
     * if you need to update some components of the dataSource,
     * you should declare another variable object to hold the reference of the dataSource,
     * otherwise you cannot make any changes by directly manipulating the dataSource from props. 
     */
    render() {
        const { dataSource } = this.state;
        const { client, navigation } = this.props;
        return (
            <Card key={dataSource._id}>
                <CardItemRow>
                    <Left>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                            onPress={() => {
                                if (client && client.user._id === dataSource.creator) {
                                    navigation.navigate('Profile')
                                } else {
                                    navigation.push('UserProfile', {
                                        username: dataSource.postUser.username,
                                        avatar: dataSource.postUser.avatar,
                                        _id: dataSource.postUser._id
                                    })
                                }
                            }}
                        >
                            <Thumbnail source={dataSource.postUser.avatar} style={{ height: 40, width: 40 }} />
                            <this.renderHeader />
                        </TouchableOpacity>
                    </Left>
                    <View style={styles.right}>
                        <Icon name="md-more" style={{ fontSize: 20 }} onPress={() => {
                            this.handleMoreOptions();
                        }} />
                    </View>
                </CardItemRow>
                <CardBody>
                    <Image source={{ uri: dataSource.image }} style={{ height: window.width, width: window.width, flex: 1 }} resizeMode='cover' />
                </CardBody>
                <CardItemRow style={[styles.cardItemRow, { marginTop: 10, height: 50 }]}>
                    <Left>
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
                </CardItemRow>
                <CardItemCol style={styles.cardItemCol}>
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
                    <View style={{ marginTop: 5, height: 20 }}>
                        <Text style={{ fontSize: 12, color: 'grey' }}>{`published ${dateConverter(dataSource.createdAt)}`}</Text>
                    </View>
                </CardItemCol>
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

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(PostCardComponent));

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
    },
    card: {
        width: window.width,
        marginTop: 0,
        marginBottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    cardItemRow: {
        width: '95%',
        height: window.height * 0.08,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap'
    },
    cardItemCol: {
        width: '95%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    cardBody: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'absolute',
        left: 0
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'absolute',
        right: 0
    }
});