import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SkypeIndicator, BallIndicator } from 'react-native-indicators';

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
            lastQueryDataIds: [],
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
        const request = this.props.request;
        const url = request.url;
        console.log(`feching data from ${url}`);
        fetch(url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify({
                lastQueryDataIds: this.state.lastQueryDataIds,
                ...request.body
            })
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    // data only appended when loading more, else refresh data
                    data: this.state.loadingMore === true ? [...this.state.data, ...res.data] : res.data,
                    lastQueryDataIds: this.state.loadingMore === true ? [...this.state.lastQueryDataIds, ...parseIdFromObjectArray(res.data)] : parseIdFromObjectArray(res.data),
                    error: res.status === 200 ? null : res.msg,
                    hasMore: res.data.length < request.body.limit ? false : true,
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
        if (!this.state.loadingMore && !this.state.refreshing && !this.state.loading) {
            this.setState({
                refreshing: true,
                lastQueryDataIds: []
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
        const props = this.props;
        return (
            <View style={styles.listFooter}>
                {this.state.hasMore ? props.footerHasMore : props.footerNoMore}
            </View>
        );
    };


    renderContent = () => {
        const props = this.props;
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><SkypeIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (<FlatList
                style={{ marginTop: 0, width: '100%' }}
                data={this.state.data}
                renderItem={({ item }) => (
                    <props.renderItem
                        dataSource={item}
                        navigation={props.navigation}
                        itemProps={props.itemProps}
                    />
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
