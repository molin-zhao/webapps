import React from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewMoreText from 'react-native-view-more-text';
import { BallIndicator } from 'react-native-indicators';

import Header from '../../components/Header';
import DismissKeyboard from '../../components/DismissKeyboard';
import TextInputBox from '../../components/TextInputBox';
import Thumbnail from '../../components/Thumbnail';
import CreatorTag from '../../components/CreatorTag';
import DynamicListView from '../../components/DynamicContentListView';
import ReplyListCell from '../../components/ReplyListCell';

import { dateConverter } from '../../utils/unitConverter';
import config from '../../common/config';
import baseUrl from '../../common/baseUrl';


export default class CommentDetail extends React.Component {

    renderComment = (dataSource) => {
        return (
            <View style={styles.comment}>
                <View style={styles.commentUserAvatar}>
                    <Thumbnail source={dataSource.commentBy.avatar} style={{ width: 40, height: 40 }} />
                </View>
                <View style={styles.commentContentWrapper}>
                    <View style={styles.commentUsername}>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                            {dataSource.commentBy.username}
                        </Text>
                        <CreatorTag byCreator={dataSource.commentByPostCreator} />
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
                        <View style={{
                            width: '30%',
                            height: '100%',
                            position: 'absolute',
                            right: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.commentMetaIcon}>
                                <Icon name="ios-thumbs-up" style={{ color: dataSource.liked ? '#eb765a' : 'grey' }} />
                                <Text style={{ color: 'grey', fontSize: 12 }}>{dataSource.likeCount}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { navigation } = this.props;
        const dataSource = navigation.getParam('dataSource');
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="comments"
                    rightIconButton={
                        <Icon name="md-close" style={{ fontSize: 24 }} />
                    }
                    rightButtonOnPress={() => {
                        navigation.dismiss();
                    }}

                    leftIconButton={
                        <Icon name="md-arrow-back" style={{ fontSize: 24 }} />
                    }

                    leftButtonOnPress={() => {
                        navigation.goBack()
                    }}
                />
                {this.renderComment(dataSource)}
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
                    <DismissKeyboard>
                        <DynamicListView
                            itemProps={{ creatorId: navigation.getParam("creatorId") }}
                            request={{
                                url: `${baseUrl.api}/post/comment/reply`,
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: {
                                    limit: config.replyReturnLimit,
                                    commentId: dataSource._id
                                }
                            }}
                            renderItem={ReplyListCell}
                            footerHasMore={<BallIndicator size={20} />}
                            footerNoMore={<Text style={{ color: 'grey', fontSize: 12 }}>- No more replies -</Text>}
                        />
                    </DismissKeyboard>
                    <TextInputBox />
                </KeyboardAvoidingView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    comment: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentUserAvatar: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentContentWrapper: {
        width: '85%',
        justifyContent: 'flex-start',
        alignItems: 'center'
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
    commentUsername: {
        width: '98%',
        height: 20,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    commentMetaIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: '3%'
    },
});