import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
    BallIndicator,
    BarIndicator,
    DotIndicator,
    MaterialIndicator,
    PacmanIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator
} from 'react-native-indicators'
import PostCardComponent from '../../components/PostCardComponent';
import baseUrl from '../../common/baseUrl';
import config from '../../common/config';
import window from '../../utils/getWindowSize';
import { parseIdFromObjectArray } from '../../utils/parseIdFromObjectArray';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            error: null,
            loading: false,
            refreshing: false,
            loadingMore: false,
            hasMore: true,
            lastPosts: [],
        };
    }

    componentDidMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchPosts();
        })
    }

    fetchPosts = () => {
        const url = `${baseUrl.api}/post/${config.postReturnLimit}`;
        console.log(`feching data from ${url}`);
        fetch(url, {

            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: global.userinfo ? global.userinfo.user : null,
                lastPosts: this.state.lastPosts,
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    // data only appended when loading more, else refresh data
                    data: this.state.loadingMore === true ? [...this.state.data, ...res.data] : res.data,
                    lastPosts: this.state.loadingMore === true ? [...this.state.lastPosts, ...parseIdFromObjectArray(res.data)] : parseIdFromObjectArray(res.data),
                    error: res.status === 200 ? null : res.msg,
                    hasMore: res.data.length < config.postReturnLimit ? false : true,
                    loading: false,
                    refreshing: false,
                    loadingMore: false,
                });
            })
            .catch(error => {
                this.setState({ error: "Network request failed", loading: false, refreshing: false });
            });
    };

    handleRefresh = () => {
        console.log("refreshing");
        this.setState({
            refreshing: true,
            lastPosts: []
        }, () => {
            this.fetchPosts();
        })
    };

    handleLoadMore = () => {
        console.log("loading more");
        if (this.state.hasMore) {
            this.setState(
                {
                    loadingMore: true
                },
                () => {
                    this.fetchPosts();
                }
            );
        }
    };

    renderFooter = () => {
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? <SkypeIndicator size={25} /> : <Text style={{ color: 'grey' }}>No more posts</Text>}
            </View>
        );
    };

    renderPost = () => {
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><SkypeIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (<FlatList
                style={{ marginTop: 0, width: window.width }}
                data={this.state.data}
                renderItem={({ item }) => (
                    <PostCardComponent dataSource={item} navigation={this.props.navigation} />
                )}
                keyExtractor={item => item._id}
                onRefresh={this.handleRefresh}
                refreshing={this.state.refreshing}
                ListFooterComponent={this.renderFooter}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={0.2}
            />);
        }
    }

    render() {
        return (
            <View
                style={styles.container}
                containerStyle={styles.contentContainer}
            >
                <this.renderPost />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contentContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginTop: 0,
    },
    container: {
        backgroundColor: '#fff'
    },
    listFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    errorMsgView: {
        height: window.height * 0.85,
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});