import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import Thumbnail from '../components/Thumbnail';

import window from '../utils/getDeviceInfo';
import { dateConverter } from '../utils/unitConverter';

class FollowingMessasgeDetailListCell extends React.Component {

    renderDate = (createdAt) => {
        return (
            <Text style={{ color: 'grey', fontSize: 12 }}>{dateConverter(createdAt)}</Text>
        );
    }

    renderContent = () => {
        const { dataSource } = this.props;
        const { messageType, sender, receiver, postReference, commentReference, replyReference, createdAt } = dataSource;
        switch (messageType) {
            case 'LikePost':
                return (
                    <View style={styles.content}>
                        <View style={{
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>{sender.username}</Text>
                            <Icon name='ios-heart-outline' size={18} />
                            {this.renderDate(createdAt)}
                        </View>
                        <View style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: postReference.image }} />
                        </View>
                    </View>
                );
            case 'LikeComment':
                return (
                    <View style={styles.content}>
                        <View style={{
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontWeight: 'bold' }}>{sender.username}</Text>
                                <Icon name='ios-heart-outline' size={18} style={{ marginLeft: 10 }} />
                                <Text style={{ marginLeft: 10 }}>{`${receiver.username}'s comment`}</Text>
                            </View>
                            <Text numberOfLines={2} ellipsizeMode='tail'>{commentReference.content}</Text>
                            {this.renderDate(createdAt)}
                        </View>
                        <View style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: postReference.image }} />
                        </View>
                    </View>
                );
            case 'LikeReply':
                return (
                    <View style={styles.content}>
                        <View style={{
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontWeight: 'bold' }}>{sender.username}</Text>
                                <Icon name='ios-heart-outline' size={18} style={{ marginLeft: 10 }} />
                                <Text style={{ marginLeft: 10 }}>{`${receiver.username}'s reply`}</Text>
                            </View>
                            <Text numberOfLines={2} ellipsizeMode='tail'>{commentReference.content}</Text>
                            {this.renderDate(createdAt)}
                        </View>
                        <View style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: postReference.image }} />
                        </View>
                    </View>
                );
            case 'CommentPost':
                return (
                    <View style={styles.content}>
                        <View style={{
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>{sender.username}</Text>
                            <Text numberOfLines={2} ellipsizeMode='tail'>{commentReference.content}</Text>
                            {this.renderDate(createdAt)}
                        </View>
                        <View style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: postReference.image }} />
                        </View>
                    </View>
                );
            case 'ReplyReply':
            case 'ReplyComment':
                return (
                    <View style={styles.content}>
                        <View style={{
                            width: '70%',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{ fontWeight: 'bold' }}>{sender.username}</Text>
                                <Text style={{ marginLeft: 10 }}>{`replied to ${receiver.username}`}</Text>
                            </View>
                            <Text numberOfLines={2} ellipsizeMode='tail'>{replyReference.content}</Text>
                            {this.renderDate(createdAt)}
                        </View>
                        <View style={{
                            width: '30%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: postReference.image }} />
                        </View>
                    </View>
                );
            case 'Follow':
                return (
                    <View style={styles.content}>
                        <View style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'flex-start'
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>{sender.username}</Text>
                            <Text>{'started following you'}</Text>
                            {this.renderDate(createdAt)}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    }

    render() {
        const { dataSource } = this.props;
        const { sender } = dataSource;
        return (
            <View key={dataSource._id} style={styles.cell}>
                <View style={{
                    width: '20%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Thumbnail source={sender.avatar} style={{ width: 50, height: 50 }} />
                </View>
                {this.renderContent()}
            </View>
        );
    }
}
export default withNavigation(FollowingMessasgeDetailListCell);

const styles = StyleSheet.create({
    cell: {
        width: '100%',
        height: window.height * 0.1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '80%',
        height: '100%'
    }
})