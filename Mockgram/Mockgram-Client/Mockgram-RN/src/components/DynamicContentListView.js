import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';

import { parseIdFromObjectArray } from '../utils/idParser';

export default class DynamicContentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null,
            loading: false,
            refreshing: false,
            loadingMore: false,
            hasMore: true,
            fetching: false,
            interrupt: false
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchData();
        })
    }

    fetchData = () => {
        const { request } = this.props;
        const url = request.url;
        this.setState({
            fetching: true
        }, () => {
            console.log(`feching data from ${url}`);
            fetch(url, {
                method: request.method,
                headers: request.headers,
                body: JSON.stringify({
                    lastQueryDataIds: this.state.loadingMore ? parseIdFromObjectArray(data) : [],
                    ...request.body
                })
            })
                .then(res => res.json())
                .then(res => {
                    if (!this.state.interrupt) {
                        this.setState({
                            // data only appended when loading more, else refresh data
                            data: this.state.data.concat(...res.data),
                            error: res.status === 200 ? null : res.msg,
                            hasMore: res.data.length < request.body.limit ? false : true
                        });
                    } else {
                        this.setState({
                            interrupt: false
                        })
                    }
                }).then(() => {
                    this.setState({
                        loading: false,
                        refreshing: false,
                        loadingMore: false,
                        fetching: false
                    })
                })
                .catch(error => {
                    this.setState({
                        error: error,
                        loading: false,
                        refreshing: false,
                        loadingMore: false,
                        fetching: false,
                        interrupt: false
                    });
                });
        })
    };

    handleRefresh = () => {
        if (!this.state.refreshing && !this.state.loading) {
            if (this.state.fetching) {
                this.setState({
                    interrupt: true
                })
            }
            this.setState({
                refreshing: true,
            }, () => {
                console.log("refreshing");
                this.fetchData();
            })
        }
    };

    handleLoadMore = () => {
        if (this.state.hasMore && !this.state.loadingMore && !this.state.refreshing && !this.state.loading) {
            this.setState(
                {
                    loadingMore: true
                },
                () => {
                    console.log("loading more");
                    this.fetchData();
                }
            );
        }
    };



    renderFooter = () => {
        const { footerHasMore, footerNoMore } = this.props;
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? footerHasMore : footerNoMore}
            </View>
        );
    };

    listEmpty = () => {
        const { error } = this.state;
        if (error) {
            return (
                <View style={styles.errorMsgView}>
                    <Text>{error}</Text>
                </View >
            );
        }
        return (
            <View style={styles.errorMsgView}>
                <Text>{`- Nothing found -`}</Text>
            </View >
        );
    }

    renderContent = () => {
        const { itemProps } = this.props;
        if (this.state.loading) {
            return (
                <View style={styles.errorMsgView}>
                    <SkypeIndicator />
                </View>);
        } else {
            return (
                <FlatList
                    style={{ marginTop: 0, width: '100%' }}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <this.props.renderItem
                            dataSource={item}
                            itemProps={itemProps}
                        />
                    )}
                    ListEmptyComponent={this.listEmpty}
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
                <this.renderContent />
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    errorMsgView: {
        height: window.height * 0.85,
        width: window.width,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
