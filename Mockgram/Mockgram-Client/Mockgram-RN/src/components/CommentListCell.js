import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import Icon from 'react-native-vector-icons/Ionicons';

import { dateConverter } from '../utils/unitConverter';
import Thumbnail from './Thumbnail';
import CreatorTag from './CreatorTag';

export default class CommentListCell extends React.Component {

    renderViewAllReply = (replyLength) => {
        const { navigation } = this.props;
        if (replyLength > 0) {
            return (
                <View style={{ marginLeft: '15%', width: '85%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 20, marginBottom: 3 }}>
                    <TouchableOpacity
                        style={{ width: '98%', height: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}
                        onPress={() => {
                            navigation.navigate('CommentDetail', {
                                ...this.props
                            })
                        }}
                    >
                        <Text style={{ color: '#4696EC', fontSize: 13, fontWeight: 'bold' }}>
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
                                            <Text style={{ color: '#4696EC' }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>
                                        </TouchableOpacity>);

                                }}
                                renderViewLess={(onPress) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: '#4696EC' }}>{`show less `}<Icon name="md-arrow-dropup" /></Text>
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
                                    <Icon name="ios-thumbs-up" style={{ color: replyByPostCreator.liked ? '#eb765a' : 'grey' }} />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{replyByPostCreator.likeCount}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.commentMetaIcon}
                                >
                                    <Icon name="ios-thumbs-down" style={{ color: replyByPostCreator.disliked ? '#eb765a' : 'grey' }} />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{replyByPostCreator.dislikeCount}</Text>
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
        const { dataSource, creatorId } = this.props;
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
                                            <Text style={{ color: '#4696EC' }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>
                                        </TouchableOpacity>);

                                }}
                                renderViewLess={(onPress) => {
                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={onPress}
                                            style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                            <Text style={{ color: '#4696EC' }}>{`show less `}<Icon name="md-arrow-dropup" /></Text>
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
                                    <Icon name="ios-thumbs-up" style={{ color: dataSource.liked ? '#eb765a' : 'grey' }} />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{dataSource.likeCount}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.commentMetaIcon}
                                >
                                    <Icon name="ios-thumbs-down" style={{ color: dataSource.disliked ? '#eb765a' : 'grey' }} />
                                    <Text style={{ color: 'grey', fontSize: 12 }}>{dataSource.dislikeCount}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.commentMetaIcon}
                                >
                                    <Icon name="ios-chatboxes" style={{ color: 'grey' }} />
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
        width: '30%',
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