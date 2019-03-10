import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import { dateConverter, numberConverter } from '../utils/unitConverter';
import Thumbnail from './Thumbnail';
import CreatorTag from './CreatorTag';
import theme from '../common/theme';
import baseUrl from '../common/baseUrl';

class CommentListCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.dataSource,
            creatorId: this.props.creatorId
        }
    }

    componentDidMount() {
        // console.log(this.state.dataSource);
    }

    handleReply = () => {
        const { client, navigation, controller } = this.props;
        const { dataSource } = this.state;
        if (client && client.user) {
            // user token is required for a comment or reply
            controller._textInput.updateMessageReceiver({
                _id: dataSource.commentBy._id,
                username: dataSource.commentBy.username,
                commentId: dataSource._id,
                postId: dataSource.postId,
                type: 'reply'
            });
        } else {
            navigation.navigate('Auth');
        }
    }

    handleLikeReplyByCreator = () => {
        /**
         * reply like
         */
        const { client, navigation } = this.props;
        const { dataSource } = this.state;
        if (client && client.token) {
            const url = `${baseUrl.api}/post/comment/reply/liked`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    Authorization: client.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    replyId: dataSource.replyByPostCreator._id,
                    postId: dataSource.postId,
                    addLike: !dataSource.replyByPostCreator.liked
                })
            }).then(res => res.json()).then(res => {
                if (res.status === 200) {
                    dataSource.replyByPostCreator.likeCount = dataSource.replyByPostCreator.liked ? dataSource.replyByPostCreator.likeCount - 1 : dataSource.replyByPostCreator.likeCount + 1;
                    dataSource.replyByPostCreator.liked = !dataSource.replyByPostCreator.liked;
                    this.setState({
                        dataSource: dataSource
                    });
                }
            })
        } else {
            navigation.navigate('Auth');
        }
    }

    handleLiked = () => {
        /**
         * comment like
         */
        const { client, navigation } = this.props;
        const { dataSource } = this.state;
        if (client && client.token) {
            const url = `${baseUrl.api}/post/comment/liked`;
            fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    Authorization: client.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentId: dataSource._id,
                    addLike: !dataSource.liked
                })
            }).then(res => res.json()).then(res => {
                if (res.status === 200) {
                    dataSource.likeCount = dataSource.liked ? dataSource.likeCount - 1 : dataSource.likeCount + 1;
                    dataSource.liked = !dataSource.liked;
                    this.setState({
                        dataSource: dataSource
                    });
                }
            })
        } else {
            navigation.navigate('Auth');
        }
    }

    renderViewAllReply = (replyLength) => {
        const { navigation } = this.props;
        if (replyLength > 0) {
            return (
                <View style={{ marginLeft: '15%', width: '85%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 20, marginBottom: 3 }}>
                    <TouchableOpacity
                        style={{ width: '98%', height: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => {
                            navigation.navigate('CommentDetail', {
                                dataSource: this.state.dataSource,
                                creatorId: this.state.creatorId
                            })
                        }}
                    >
                        <Text style={{ color: theme.primaryBlue, fontSize: 13, fontWeight: 'bold' }}>
                            {`View all ${replyLength} replies`}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }

    renderReplyByCreator = (replyByPostCreator) => {
        if (replyByPostCreator) {
            return (
                <View style={styles.replyContainer}>
                    <View style={styles.replyContents}>
                        <View style={styles.username}>
                            <Thumbnail source={replyByPostCreator.from.avatar} style={{ width: 16, height: 16 }} />
                            <Text style={{ marginLeft: 3, fontWeight: "bold", fontSize: 12 }}>
                                {replyByPostCreator.from.username}
                            </Text>
                            <CreatorTag byCreator={true} />
                            <Icon name="md-arrow-dropright" style={{ marginLeft: 3, color: 'grey' }} />
                            <Text style={{ marginLeft: 3, fontWeight: 'bold', fontSize: 12 }}>{replyByPostCreator.to.username}</Text>
                        </View>
                        <View style={styles.commentContents}>
                            <ViewMoreText
                                numberOfLines={1}
                                renderViewMore={(onPress) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: theme.primaryBlue }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>
                                        </TouchableOpacity>);

                                }}
                                renderViewLess={(onPress) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: theme.primaryBlue }}>{`show less `}<Icon name="md-arrow-dropup" /></Text>
                                        </TouchableOpacity>);
                                }}
                            >

                                <Text style={{ fontWeight: 'normal' }}>
                                    {replyByPostCreator.content}
                                </Text>
                            </ViewMoreText>
                        </View>
                        <View style={styles.commentMeta}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{dateConverter(replyByPostCreator.createdAt)}</Text>
                            <View style={{ width: '30%', height: '100%', position: 'absolute', right: 0, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.commentMetaIcon}>
                                    <Icon
                                        name="ios-thumbs-up"
                                        style={{ color: replyByPostCreator.liked ? theme.primaryColor : 'grey' }}
                                        onPress={() => {
                                            this.handleLikeReplyByCreator()
                                        }}
                                    />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{numberConverter(replyByPostCreator.likeCount)}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
        return null;
    }

    render() {
        const { dataSource, creatorId } = this.state;
        return (
            <View key={dataSource._id} style={styles.commentListWrapper}>
                <View style={styles.commentContainer}>
                    <View style={styles.userAvatar}>
                        <Thumbnail source={dataSource.commentBy.avatar} style={{ width: 40, height: 40 }} />
                    </View>
                    <View style={styles.contents}>
                        <View style={styles.username}>
                            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                                {dataSource.commentBy.username}
                            </Text>
                            <CreatorTag byCreator={dataSource.commentBy._id === creatorId} />
                        </View>
                        <View style={styles.commentContents}>
                            <ViewMoreText
                                numberOfLines={1}
                                renderViewMore={(onPress) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: theme.primaryBlue }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>
                                        </TouchableOpacity>);

                                }}
                                renderViewLess={(onPress) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: theme.primaryBlue }}>{`show less `}<Icon name="md-arrow-dropup" /></Text>
                                        </TouchableOpacity>);
                                }}
                            >

                                <Text style={{ fontWeight: 'normal' }}>
                                    {dataSource.content}
                                </Text>
                            </ViewMoreText>
                        </View>
                        <View style={styles.commentMeta}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{dateConverter(dataSource.createdAt)}</Text>
                            <View style={{ width: '30%', height: '100%', position: 'absolute', right: 5, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.commentMetaIcon}>
                                    <Icon
                                        name="ios-thumbs-up"
                                        style={{ color: dataSource.liked ? theme.primaryColor : 'grey' }}
                                        onPress={() => {
                                            this.handleLiked()
                                        }}
                                    />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{numberConverter(dataSource.likeCount)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.commentMetaIcon}
                                >
                                    <Icon
                                        name="ios-chatboxes"
                                        style={{ color: 'grey' }}
                                        onPress={() => {
                                            this.handleReply();
                                        }}
                                    />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{dataSource.replyCount}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                {this.renderReplyByCreator(dataSource.replyByPostCreator)}
                {this.renderViewAllReply(dataSource.replyCount)}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    client: state.client.client,
})

export default connect(mapStateToProps, null)(withNavigation(CommentListCell))

const styles = StyleSheet.create({
    commentListWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },
    commentContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    userAvatar: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    contents: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
    },
    commentContents: {
        width: '98%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    commentMeta: {
        width: '98%',
        height: 20,
        marginTop: 2,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    username: {
        width: '98%',
        height: 20,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    commentMetaIcon: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: '3%'
    },
    replyContainer: {
        width: '85%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '15%',
    },
    replyContents: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '98%'
    }
})