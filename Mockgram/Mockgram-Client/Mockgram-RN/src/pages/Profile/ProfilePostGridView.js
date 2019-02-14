import React from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { BallIndicator, SkypeIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';

import PostGridViewImage from '../../components/PostGridViewImage';

import config from '../../common/config';
import { getClientProfilePosts } from '../../redux/actions/profileActions';
import window from '../../utils/getDeviceInfo';

class ProfilePostGridView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.dataSource ? this.props.dataSource : [],
            loading: false,
            refreshing: false,
            loadingMore: false,
            hasMore: true,
            error: null,
        }
    }

    componentDidMount() {
        const { userId, type, dataSource, fetchPosts } = this.props;
        this.setState({
            loading: true
        }, () => {
            fetchPosts(this, dataSource, userId, type, config.profilePostReturnLimit);
        })
    }

    handleLoadMore = () => {
        const { userId, type, dataSource } = this.props;
        if (this.state.hasMore && !this.state.loading && !this.state.refreshing && !this.state.loadingMore) {
            this.setState({
                loadingMore: true
            }, () => {
                this.props.fetchPosts(this, dataSource, userId, type, config.profilePostReturnLimit);
            })
        }
    }

    renderEmpty = () => {
        const { dataSource, type } = this.props;
        let data = dataSource ? dataSource : this.state.data;
        if (!this.state.refreshing && !this.state.loading && !this.state.loadingMore && data.length === 0) {
            if (type === 'CREATED') {
                return (
                    <View style={styles.postViewEmptyMsg}>
                        <Icon name='ios-camera' style={{ fontSize: 32 }} />
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>Your posts</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300' }}>The photos you posted will appear on your profile</Text>
                    </View>
                );
            } else if (type === 'LIKED') {
                return (
                    <View style={styles.postViewEmptyMsg}>
                        <Icon name='ios-heart-outline' style={{ fontSize: 32 }} />
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>Liked posts</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300' }}>The posts you liked will appear on your profile</Text>
                    </View>
                );
            } else if (type === 'MENTIONED') {
                return (
                    <View style={styles.postViewEmptyMsg}>
                        <Icon name='ios-at-outline' style={{ fontSize: 32 }} />
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>Shared posts</Text>
                        <Text style={{ fontSize: 14, fontWeight: '300' }}>The posts shared with you will appear on your profile</Text>
                    </View>
                );
            } else {
                return null;
            }
        }
        return null;
    }

    renderFooter = () => {
        const { dataSource } = this.props;
        let data = dataSource ? dataSource : this.state.data;
        if (this.state.loadingMore && this.state.hasMore) {
            return (
                <View style={styles.footer}>
                    <SkypeIndicator size={24} />
                </View>
            );
        } else if (!this.state.hasMore && data.length !== 0) {
            return (
                <View style={styles.footer}>
                    <Text style={{ color: 'grey', fontSize: 12 }}> - No more posts - </Text>
                </View>
            );
        } else {
            return null;
        }
    }

    renderPostGridView = () => {
        const { navigation, numColumns, dataSource } = this.props;
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><BallIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (
                <FlatList
                    data={dataSource ? dataSource : this.state.data}
                    style={{ backgroundColor: '#fff', width: '100%', marginTop: 0 }}
                    renderItem={({ item }) => (
                        <PostGridViewImage dataSource={item} navigation={navigation} numColumns={numColumns} />
                    )}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmpty}
                    numColumns={numColumns}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.1}
                    keyExtractor={item => item._id}
                />
            );
        }
    }


    render() {
        return (
            <View style={styles.container}>
                {this.renderPostGridView()}
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPosts: (caller, dataSource, userId, type, limit) => dispatch(getClientProfilePosts(caller, dataSource, userId, type, limit))
})

export default connect(null, mapDispatchToProps)(ProfilePostGridView)

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    errorMsgView: {
        height: window.width * 0.4,
        width: window.width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    postViewEmptyMsg: {
        height: window.height * 0.4,
        width: window.width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
})
