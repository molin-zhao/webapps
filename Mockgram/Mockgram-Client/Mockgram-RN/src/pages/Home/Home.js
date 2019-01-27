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
import { client } from '../../redux/reducers/clientReducers';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            error: null,
            loading: false,
            refreshing: false,
            loadingMore: false,
            hasMore: true,
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
            loading: true
        }, () => {
            this.fetchPosts();
        })
    }

    fetchPosts = () => {
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
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    // data only appended when loading more, else refresh data
                    data: this.state.loadingMore === true ? [...this.state.data, ...res.data] : res.data,
                    error: res.status === 200 ? null : res.msg,
                    hasMore: res.data.length < config.postReturnLimit ? false : true,
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
                lastPosts: []
            }, () => {
                console.log("refreshing");
                this.fetchPosts();
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
                    this.fetchPosts();
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
        if (this.state.loading) {
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
                <this.renderPost />
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