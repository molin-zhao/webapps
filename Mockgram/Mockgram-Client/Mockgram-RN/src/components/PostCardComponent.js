import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Card, CardItem, Thumbnail, Body, Left, Right } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewMoreText from 'react-native-view-more-text';
import Comment from './Comment';
import window from '../utils/getWindowSize';
import { dateConverter } from '../utils/unitConverter';
export default class PostCardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: this.props.navigation,
            dataSource: this.props.dataSource,
            liked: false,
            showComments: false
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
        this.showModal();
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
                <Text style={headerStyle}>{this.state.dataSource.postBy.username}</Text>
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
            <Text style={headerStyle}>{this.state.dataSource.postBy.username}</Text>
        </Body>);
    }

    render() {
        return (
            <Card key={this.state.dataSource._id} style={{ width: window.width, marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
                <CardItem>
                    <Left>
                        <Thumbnail source={this.state.dataSource.postBy.avatar === '' ? require('../static/user.png') : {
                            uri: this.state.dataSource.postBy.avatar
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
                            <Text style={{ fontSize: 12 }}>{this.state.liked ? this.state.dataSource.likes + 1 : this.state.dataSource.likes}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                this.handleComment();
                            }}>
                                <Icon name="ios-chatboxes-outline" style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{this.state.dataSource.comments}</Text>
                        </View>
                        <View style={styles.cardLabels}>
                            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                                this.handleShare();
                            }}>
                                <Icon name="ios-open-outline" style={{ fontSize: 24 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12 }}>{this.state.dataSource.shared}</Text>
                        </View>
                    </Left>
                </CardItem>
                <CardItem>
                    <Body>
                        <View>
                            <ViewMoreText
                                numberOfLines={2}
                                renderViewMore={(onPress) => {
                                    return (<Text style={{ marginTop: 5, color: '#4696EC' }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>);
                                }}
                                renderViewLess={(onPress) => {
                                    return (<Text style={{ marginTop: 5, color: '#4696EC' }} onPress={onPress}>{`show less `}<Icon name="md-arrow-dropup" /></Text>);
                                }}
                            >
                                <Text style={{ fontWeight: "bold" }}>
                                    {this.state.dataSource.postBy.username}
                                    <Text style={{ fontWeight: 'normal' }}>
                                        {`  ${this.state.dataSource.description}`}
                                    </Text>
                                </Text>
                            </ViewMoreText>
                        </View>
                        <View style={{ marginTop: 5, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>{`published ${dateConverter(this.state.dataSource.createdAt)}`}</Text>
                        </View>
                    </Body>
                </CardItem>
                <Modal
                    animationIn='slideInUp'
                    animationOut='slideOutDown'
                    isVisible={this.state.showComments}
                    backdropOpacity={0.5}
                    onBackdropPress={() => {
                        this.hideModal();
                    }}
                    hideModalContentWhileAnimating={true}
                    onBackButtonPress={() => {
                        this.hideModal();
                    }}
                    style={{ margin: 0, justifyContent: 'flex-end' }}
                >
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, height: window.height * 0.7 }}>
                        <View style={{ height: window.height * 0.05, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: '100%', flex: 1 }}></View>
                            <View style={{ height: '100%', flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 15, color: 'grey', fontWeight: 'bold' }}>{`${0} comments`}</Text></View>
                            <View style={{ height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="md-close" style={{ fontSize: 20 }} onPress={() => {
                                    this.hideModal();
                                }} />
                            </View>
                        </View>
                        <Comment />
                    </View>
                </Modal>
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