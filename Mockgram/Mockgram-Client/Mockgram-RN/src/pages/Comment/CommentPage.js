import React from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, FlatList, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SkypeIndicator, BallIndicator } from 'react-native-indicators';
import { connect } from 'react-redux';

import CommentListCell from '../../components/CommentListCell';
import TextInputBox from '../../components/TextInputBox';
import Header from '../../components/Header';

import config from '../../common/config';
import baseUrl from '../../common/baseUrl';
import { parseIdFromObjectArray } from '../../utils/idParser';
import window from '../../utils/getDeviceInfo';

class CommentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            postId: this.props.navigation.getParam('postId', null),
            creatorId: this.props.navigation.getParam('creatorId', null),
            loading: false,
            loadingMore: false,
            hasMore: true,
            fetching: false,
            interrupt: false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true,
            data: []
        }, () => {
            this.fetchComment();
        });
    }

    componentWillUpdate(nextProps) {
        const { client } = this.props;
        if (client != nextProps.client) {
            this.handleReload();
        }
    }

    fetchComment = () => {
        const { client } = this.props;
        const url = `${baseUrl.api}/post/comment`;
        this.setState({
            fetching: true
        }, () => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lastQueryDataIds: this.state.loadingMore ? parseIdFromObjectArray(this.state.data) : [],
                    postId: this.state.postId,
                    creatorId: this.state.creatorId,
                    limit: config.commentReturnLimit,
                    userId: client && client.user ? client.user._id : null
                })
            }).then(res => res.json()).then(res => {
                if (this.state.interrupt) {
                    this.setState({
                        interrupt: false
                    })
                } else {
                    this.setState({
                        data: this.state.loadingMore === true ? [...this.state.data, ...res.data] : res.data,
                        error: res.status === 200 ? null : res.msg,
                        hasMore: res.data.length < config.commentReturnLimit ? false : true,
                    });
                }
            }).then(() => {
                this.setState({
                    loading: false,
                    loadingMore: false,
                    fetching: false
                })
            }).catch(error => {
                this.setState({
                    error: error,
                    loading: false,
                    loadingMore: false,
                    fetching: false
                });
            });
        })
    };

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
            this.fetchComment();
        })
    }

    handleLoadMore = () => {
        if (this.state.hasMore && !this.state.loadingMore && !this.state.loading) {
            this.setState(
                {
                    loadingMore: true
                },
                () => {
                    this.fetchComment();
                }
            );
        }
    };

    renderFooter = () => {
        const { data, hasMore } = this.state;
        if (data.length !== 0) {
            return (
                <View style={styles.listFooter}>
                    {hasMore ? <BallIndicator size={20} /> : <Text style={{ color: 'grey', fontSize: 12 }}>- No more comments -</Text>}
                </View>
            );
        }
        return null;
    };

    renderEmpty = () => {
        return (
            <View style={styles.errorMsgView}>
                <Icon name="md-paper" size={window.height * 0.05} />
                <Text>- Be the first to leave a comment -</Text>
            </View>
        );
    }


    renderComment = () => {
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><SkypeIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (
                <FlatList
                    style={{ marginTop: 0, width: '100%', flex: 1 }}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <CommentListCell
                            dataSource={item}
                            creatorId={this.state.creatorId}
                            textInputController={this._textInput}
                        />
                    )}
                    keyExtractor={item => item._id}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
            );
        }
    }


    render() {
        const { navigation } = this.props;
        const { postId } = this.state;
        return (
            <View style={styles.container}>
                <Header
                    headerTitle="All Comments"
                    rightIconButton={
                        <Icon name="md-close" style={{ fontSize: 24 }} />
                    }
                    rightButtonOnPress={() => {
                        navigation.dismiss();
                    }}
                />
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: '100%', flexDirection: 'column' }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this._textInput.dismiss();
                        }}
                    >
                        <View style={styles.contentContainer}>
                            {this.renderComment()}
                        </View>
                    </TouchableWithoutFeedback>
                    <TextInputBox
                        onRef={o => this._textInput = o}
                        defaultMessageReceiver={
                            {
                                _id: '',
                                username: '',
                                commentId: '',
                                postId: postId,
                                type: 'comment',
                                dataCallbackController: this
                            }
                        }
                    />
                </KeyboardAvoidingView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        width: window.width,
        height: window.height,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = state => ({
    client: state.client.client
})

export default connect(mapStateToProps, null)(CommentPage);
