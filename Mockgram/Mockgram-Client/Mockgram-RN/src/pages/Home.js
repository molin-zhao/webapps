import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { List } from 'react-native-elements';
import PostCardComponent from '../components/PostCardComponent';
import baseUrl from '../common/baseUrl';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: [],
            error: null,
            refreshing: false,
            page: 1,
        };
    }

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = () => {
        const url = `${baseUrl.api}/post`;
        this.setState({ loading: true });

        fetch(url)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: [...this.state.data, ...res.data],
                    error: res.status === 200 ? null : res.msg,
                    loading: false,
                    refreshing: false
                });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    };

    handleRefresh = () => {
        this.setState({
            data: []
        })
        this.fetchPosts();
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

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };
    render() {
        console.log('home rendered');
        return (
            <View style={styles.container}>
                <FlatList
                    style={{ marginTop: 0, width: window.width }}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <PostCardComponent dataSource={item} />
                    )}
                    keyExtractor={item => item._id}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.loading}
                // onEndReached={this.handleLoadMore}
                // onEndReachedThreshold={0}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        marginTop: 0,
    },
});