import React from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { BallIndicator } from 'react-native-indicators';
import { createStackNavigator } from 'react-navigation';

import CommentDetail from '../../components/CommentDetail';
import TextInputBox from '../../components/TextInputBox';
import DismissKeyboard from '../../components/DismissKeyboard';

import config from '../../common/config';
import baseUrl from '../../common/baseUrl';
import { parseIdFromObjectArray } from '../../utils/parseIdFromObjectArray';
import window from '../../utils/getWindowSize';

class CommentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            lastComments: [],
            parent: this.props.navigation.getParam('parent', null),
            postId: this.props.navigation.getParam('postId', null),
            creatorId: this.props.navigation.getParam('postCreatorId', null),
            refreshing: false,
            loadidng: false,
            loadingMore: false,
            hasMore: true
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchComment();
        });
    }

    fetchComment = () => {
        const url = `${baseUrl.api}/post/comment`;
        console.log(`feching data from ${url}`);
        fetch(url, {

            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lastComments: this.state.lastComments,
                postId: this.state.postId,
                creatorId: this.state.creatorId,
                limit: config.commentReturnLimit
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    // data only appended when loading more, else refresh data
                    comment: this.state.loadingMore === true ? [...this.state.comments, ...res.data] : res.data,
                    lastComments: this.state.loadingMore === true ? [...this.state.lastComments, ...parseIdFromObjectArray(res.data)] : parseIdFromObjectArray(res.data),
                    error: res.status === 200 ? null : res.msg,
                    hasMore: res.data.length < config.commentReturnLimit ? false : true,
                    loading: false,
                    refreshing: false,
                    loadingMore: false,
                });
            })
            .catch(error => {
                this.setState({ error: "Network request failed", loading: false, refreshing: false, loadingMore: false });
            });
    };

    handleRefresh = () => {
        if (!this.state.refreshing && !this.state.loadingMore && !this.state.loading) {
            this.setState({
                refreshing: true,
                lastComments: []
            }, () => {
                console.log("refreshing");
                this.fetchComment();
            })
        }
    };

    handleLoadMore = () => {
        if (this.state.hasMore && !this.state.refreshing && !this.state.loadingMore && !this.state.loading) {
            this.setState(
                {
                    loadingMore: true
                },
                () => {
                    console.log("loading more");
                    this.fetchComment();
                }
            );
        }
    };

    renderFooter = () => {
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? <BallIndicator size={20} /> : <Text style={{ color: 'grey' }}>No more posts</Text>}
            </View>
        );
    };


    render() {
        const { navigation } = this.props;
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <DismissKeyboard>
                    <View style={{ height: 20, marginTop: 0, flex: 1 }}>
                        <Text onPress={() => {
                            navigation.navigate("CommentDetail");
                        }}>more comment</Text>
                    </View>
                </DismissKeyboard>
                <TextInputBox />
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: window.width,
        height: window.height,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    }
});


export default CommentNavigator = createStackNavigator({
    CommentPage: CommentPage,
    CommentDetail: CommentDetail
})

