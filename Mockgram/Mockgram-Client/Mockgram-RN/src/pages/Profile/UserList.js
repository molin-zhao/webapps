import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { SkypeIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/FontAwesome';

import UserListCell from '../../components/UserListCell';
import baseURL from '../../common/baseUrl';
import config from '../../common/config';
import { parseIdFromObjectArray } from '../../utils/idParser';
import window from '../../utils/getDeviceInfo';

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            userId: this.props.navigation.getParam('userId', null),
            type: this.props.navigation.getParam('type', 'Follower'),
            loading: false,
            refreshing: false,
            loadingMore: false,
            hasMore: true,
            error: null
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('type', 'Follower'),
        headerLeft: (
            <TouchableOpacity style={{ marginLeft: 20 }}
                onPress={() => {
                    navigation.goBack();
                }}>
                <Icon name='chevron-left' size={20} />
            </TouchableOpacity>
        )
    });

    componentDidMount() {
        const { userId, type } = this.state;
        let limit = config.userListReturnLimit;
        this.setState({
            loading: true
        }, () => {
            this.fetchUsers(userId, type, limit);
        })
    }

    fetchUsers = (userId, type, limit) => {

        return fetch(`${baseURL.api}/profile/user`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                limit: limit,
                userId: userId,
                lastQueryDataIds: this.state.loadingMore ? parseIdFromObjectArray(this.state.data) : [],
                type: type
            })
        }).then(res => res.json()).then(res => {
            if (res.status === 200) {
                this.setState({
                    data: this.state.loadingMore ? this.state.data.concat(res.data) : res.data,
                    hasMore: res.data.length < limit ? false : true
                });
            } else {
                this.setState({
                    error: res.msg
                })
            }
        }).then(() => {
            this.setState({
                loading: false,
                refreshing: false,
                loadingMore: false
            })
        }).catch(err => {
            console.log(err);
        })
    }


    listEmpty = () => {
        return (
            <View style={styles.listEmpty}>
                <Text style={{ fontSize: 12, marginTop: 20 }}>{` - No ${this.state.type}s - `}</Text>
            </View>
        );
    }

    handleRefresh = () => {
        if (!this.state.loading && !this.state.refreshing) {
            const { userId, type } = this.state;
            let limit = config.userListReturnLimit;
            this.setState({
                refreshing: true
            }, () => {
                this.fetchUsers(userId, type, limit);
            })
        }
    }

    handleLoadMore = () => {
        if (!this.state.loading && !this.state.refreshing && !this.state.loadingMore && this.state.hasMore) {
            const { userId, type } = this.state;
            let limit = config.userListReturnLimit;
            this.setState({
                loadingMore: true
            }, () => {
                this.fetchUsers(userId, type, limit);
            })
        }
    }

    renderFooter = () => {
        const { loading, loadingMore, refreshing, data, hasMore, type } = this.state;
        if (!loading && !loadingMore && !refreshing && data.length === 0) {
            return null;
        }
        return (
            <View style={{
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                height: window.height * 0.1,
                width: '100%'
            }}>
                {hasMore ? <SkypeIndicator size={25} /> : <Text style={{ color: 'grey', fontSize: 12 }}>{`- No more ${type}s -`}</Text>}
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    style={{ marginTop: 0, width: '100%', backgroundColor: '#fff' }}
                    contentContainerStyle={{ backgroundColor: '#fff' }}
                    renderItem={({ item }) => (
                        <UserListCell dataSource={item} />
                    )}
                    ListEmptyComponent={this.listEmpty}
                    keyExtractor={item => item._id}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    ListFooterComponent={this.renderFooter}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.2}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    listEmpty: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})