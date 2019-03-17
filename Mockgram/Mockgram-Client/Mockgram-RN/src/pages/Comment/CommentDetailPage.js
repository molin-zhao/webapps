import React from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { BallIndicator, SkypeIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import Header from '../../components/Header';
import TextInputBox from '../../components/TextInputBox';
import ReplyListCell from '../../components/ReplyListCell';
import CommentDetail from '../../components/CommentDetail';

import config from '../../common/config';
import baseUrl from '../../common/baseUrl';
import { parseIdFromObjectArray } from '../../utils/idParser';


class CommentDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataSource: this.props.navigation.getParam('dataSource'),
            creatorId: this.props.navigation.getParam('creatorId'),
            loading: false,
            loadingMore: false,
            hasMore: true,
            fetching: false,
            interrupt: false,
            error: null
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchReplies();
        })
    }

    componentWillUpdate(nextProps) {
        const { client } = this.props;
        if (client != nextProps.client) {
            this.handleReload();
        }
    }

    fetchReplies = () => {
        const { dataSource } = this.state;
        const { client } = this.props;
        const url = `${baseUrl.api}/post/comment/reply`;
        this.setState({
            fetching: true
        }, () => {
            return fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    limit: config.replyReturnLimit,
                    commentId: dataSource._id,
                    userId: client && client.user ? client.user._id : null,
                    lastQueryDataIds: this.state.loadingMore ? parseIdFromObjectArray(this.state.data) : []
                })
            }).then(res => res.json()).then(res => {
                if (this.state.interrupt) {
                    this.setState({
                        interrupt: false
                    })
                } else {
                    this.setState({
                        data: this.state.loadingMore ? this.state.data.concat(res.data) : res.data,
                        error: res.status === 200 ? null : res.msg,
                        hasMore: res.data.length < config.replyReturnLimit ? false : true,
                    });
                }
            }).then(() => {
                this.setState({
                    loading: false,
                    loadingMore: false,
                    fetching: false
                });
            }).catch(err => {
                console.log(err);
                this.setState({
                    error: err,
                    loading: false,
                    loadingMore: false,
                    fetching: false
                });

            })
        })
    }

    handleReload = () => {
        if (this.state.fetching) {
            this.setState({
                interrupt: true
            })
        }
        this.setState({
            loading: true,
            loadingMore: false
        }, () => {
            this.fetchReplies();
        })
    }

    handleLoadMore = () => {
        if (this.state.hasMore && !this.state.loadingMore && !this.state.loading) {
            this.setState(
                {
                    loadingMore: true
                },
                () => {
                    console.log("loading more");
                    this.fetchReplies()
                }
            );
        }
    };

    renderFooter = () => {
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? <BallIndicator size={20} /> : <Text style={{ color: 'grey', fontSize: 12 }}>- No more comments -</Text>}
            </View>
        );
    };

    renderReplies = () => {
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><SkypeIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{`Network request error`}</Text></View >);
            }
            return (
                <FlatList
                    style={{ marginTop: 0, width: '100%', flex: 1 }}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <ReplyListCell
                            dataSource={item}
                            creatorId={this.state.creatorId}
                            textInputController={this._textInput}
                            dataCallbackController={this}
                        />
                    )}
                    keyExtractor={item => item._id}
                    ListFooterComponent={this.renderFooter}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
            );
        }
    }


    render() {
        const { navigation } = this.props;
        const { dataSource } = this.state;
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
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
                    <CommentDetail dataSource={dataSource} />
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this._textInput.dismiss();
                        }}
                    >
                        <View style={styles.contentContainer}>
                            {this.renderReplies()}
                        </View>
                    </TouchableWithoutFeedback>
                    <TextInputBox
                        onRef={o => this._textInput = o}
                        defaultMessageReceiver={{
                            _id: dataSource.commentBy._id,
                            username: dataSource.commentBy.username,
                            commentId: dataSource._id,
                            postId: dataSource.postId,
                            type: 'reply',
                            dataCallbackController: this
                        }} />
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    client: state.client.client
})

export default connect(mapStateToProps, null)(withNavigation(CommentDetailPage));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginTop: 0,
        width: '100%'
    },
    listFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    errorMsgView: {
        height: window.height * 0.85,
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});