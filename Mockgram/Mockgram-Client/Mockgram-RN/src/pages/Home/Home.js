import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, RefreshControl } from 'react-native';
import { PacmanIndicator } from 'react-native-indicators'
import PostCardComponent from '../../components/PostCardComponent';
import baseUrl from '../../common/baseUrl';
import config from '../../common/config';
import window from '../../utils/getWindowSize';

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
            lastPost: null
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
        const url = this.state.loadingMore ? `${baseUrl.api}/post/${this.state.lastPost._id}/${this.state.lastPost.createdAt}/${config.postReturnLimit}` : `${baseUrl.api}/post`;
        console.log(`fetching ${url}`);
        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    // data appended to the list when loading more, else replace the data
                    data: this.state.loadingMore === true ? [...this.state.data, ...res.data] : res.data,
                    error: res.status === 200 ? null : res.msg,
                    hasMore: res.data.length < config.postReturnLimit ? false : true,
                    loading: false,
                    refreshing: false,
                    loadingMore: false,
                    lastPost: res.data.length > 0 ? res.data[res.data.length - 1] : null
                });
            })
            .catch(error => {
                this.setState({ error: "Network request failed", loading: false, refreshing: false });
            });
    };

    handleRefresh = () => {
        this.setState({
            refreshing: true
        }, () => {
            this.fetchPosts();
        })
    };

    handleLoadMore = () => {
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                this.fetchPosts();
            }
        );
    };

    renderFooter = () => {
        return (
            this.state.hasMore ? null :
                <View style={styles.listFooter}>
                    <Text style={{ color: 'grey' }}>No more posts</Text>
                </View>
        );
    };

    renderPost = () => {
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><PacmanIndicator /></View>);
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
                ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            // refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            // onEndReachedThreshold={0}
            />);
        }
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                }
            >
                <this.renderPost />
            </ScrollView>
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
        height: 40
    },
    errorMsgView: {
        height: window.height * 0.85,
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});