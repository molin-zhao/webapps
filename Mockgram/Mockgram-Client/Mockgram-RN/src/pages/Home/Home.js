import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import {
    SkypeIndicator,
    BarIndicator
} from 'react-native-indicators'
import { connect } from 'react-redux';

import PostCardComponent from '../../components/PostCardComponent';
import baseUrl from '../../common/baseUrl';
import config from '../../common/config';
import window from '../../utils/getDeviceInfo';
import { parseIdFromObjectArray } from '../../utils/idParser';
import { clientListener } from '../../redux/middleware/subscriber';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null,
            hasMore: true,
            loading: true,
            refreshing: false,
            loadingMore: false
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Mockgram',
            headerStyle: {
                backgroundColor: 'white'
            },
            headerTitleStyle: {
                color: 'black',
                fontSize: 20
            }
        }
    }

    componentDidMount() {
        this.setState({
            loading: true,
            refreshing: false,
            loadingMore: false,
            data: []
        }, () => {
            this.fetchPosts(this.state.loading);
        })
    }

    componentDidUpdate(preProps) {
        let client = clientListener();
        if (client !== preProps.client) {
            this.handleReload()
        }
    }

    fetchPosts = (status) => {
        /**
         * status is one of refreshing, loading and lodingMore
         * use status to check if the network request is interrupted
         * the criteria is the value of status has been changed after receving server response 
         * */

        let _status = status;
        const url = `${baseUrl.api}/post`;
        const { client } = this.props;
        console.log(`feching data from ${url}`);
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                limit: config.postReturnLimit,
                userId: client ? client.user._id : null,
                lastQueryDataIds: parseIdFromObjectArray(this.state.data)
            })
        }).then(res => res.json()).then(res => {
            if (_status === status) {
                // request is not interrupted, continue updating data
                this.setState({
                    data: this.state.data.concat(...res.data),
                    error: res.status === 200 ? null : res.msg,
                    hasMore: res.data.length < config.postReturnLimit ? false : true,
                    loading: false,
                    refreshing: false,
                    loadingMore: false
                })
            } else {
                this.setState({
                    loading: false,
                    refreshing: false,
                    loadingMore: false
                })
            }
        }).catch(error => {
            this.setState({ error: "Network request failed", loading: false, refreshing: false, loadingMore: false });
        });
    };

    handleReload = () => {
        /**
         *  reload should have highest priority than loading more and refreshing
         *  do not need to check if page is requesting for loading more or refreshing
         *  interrupt other network requests by setting status to false
         */
        if (!this.state.loading) {
            this.setState({
                loading: true,
                refreshing: false,
                loadingMore: false,
                data: []
            }, () => {
                console.log("reloading");
                this.fetchPosts(this.state.loading);
            })
        }
    }

    handleRefresh = () => {
        /**
         *  refresh should have higher priority than load more 
         *  only check if page is requesting for loading, if it isn't, perform this request
         *  otherwise do not send refreshing page request
         *  */
        if (!this.state.refreshing && !this.state.loading) {
            this.setState({
                refreshing: true,
                loading: false,
                loadingMore: false,
                data: []
            }, () => {
                console.log("refreshing");
                this.fetchPosts(this.state.refreshing);
            })
        }
    };

    handleLoadMore = () => {
        // only loading more when request resource has more data and page is not loading, refreshing and loading more beforehand
        if (this.state.hasMore && !this.state.refreshing && !this.state.loading && !this.state.loadingMore) {
            this.setState(
                {
                    loadingMore: true,
                    refreshing: false,
                    loding: false
                },
                () => {
                    console.log("loading more");
                    this.fetchPosts(this.state.loadingMore);
                }
            );
        }
    };

    renderFooter = () => {
        if (!this.state.loading && !this.state.loadingMore && !this.state.refreshing && this.state.data.length === 0) {
            return (
                <View style={{ height: window.height * 0.9, width: window.width, backgroundColor: "#fff", justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ marginTop: window.height * 0.4, height: "10%", width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                        <BarIndicator count={5} />
                        <Text style={{ color: 'grey' }}>Temporarily no posts found</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? <SkypeIndicator size={25} /> : <Text style={{ color: 'grey' }}>No more posts</Text>}
            </View>
        );
    };

    renderPost = () => {
        if (this.state.loading || this.state.refreshing) {
            return (<View style={styles.errorMsgView}><SkypeIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (
                <FlatList
                    style={{ marginTop: 0, width: '100%' }}
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
                />
            );
        }
    }

    render() {
        return (
            <View style={styles.contentContainer}>
                {this.renderPost()}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        client: state.client.client
    }
}

export default connect(mapStateToProps, null)(Home);

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