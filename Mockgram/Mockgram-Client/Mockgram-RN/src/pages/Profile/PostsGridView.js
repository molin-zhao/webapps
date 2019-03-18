import React from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { BallIndicator, SkypeIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';

import PostGridViewImage from '../../components/PostGridViewImage';

import config from '../../common/config';
import { getClientProfilePosts } from '../../redux/actions/profileActions';
import window from '../../utils/getDeviceInfo';

class LikedPostsGridView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.dataSource ? this.props.dataSource : [],
            loading: false,
            loadingMore: false,
            hasMore: true,
            error: null,
            opacity: 0,
            zIndex: 0,
        }
    }

    show = () => {
        if (this.state.opacity === 0 && this.state.zIndex === 0) {
            this.setState({
                opacity: 1,
                zIndex: 1
            })
        }
    }

    hide = () => {
        if (this.state.opacity === 1 && this.state.zIndex === 1) {
            this.setState({
                opacity: 0,
                zIndex: 0
            })
        }
    }

    componentDidMount() {
        this.handleLoadingAndReloading();
    }

    componentDidUpdate(prevProps) {
        const { refreshing } = this.props;
        if (!prevProps.refreshing && refreshing && !this.state.loading) {
            /**
             * if refreshing prop changed from false to true and view is not currently refreshing, 
             * then refresh posts 
             * */
            this.handleLoadingAndReloading();
        }
    }

    handleLoadMore = () => {
        const { userId, dataSource, refreshing, type } = this.props;
        if (this.state.hasMore && !this.state.loading && !this.state.loadingMore && !refreshing) {
            this.setState({
                loadingMore: true
            }, () => {
                this.props.fetchPosts(this, dataSource, userId, type, config.profilePostReturnLimit);
            })
        }
    }

    handleLoadingAndReloading = () => {
        const { userId, dataSource, fetchPosts, type } = this.props;
        this.setState({
            loading: true
        }, () => {
            fetchPosts(this, dataSource, userId, type, config.profilePostReturnLimit);
        })
    }

    renderEmpty = () => {
        const { refreshing, dataSource, type } = this.props;
        const { data, loading, loadingMore } = this.state;
        let _data = dataSource ? dataSource : data;
        let title = dataSource ? 'your' : `user's`;
        if (!loading && !loadingMore && !refreshing && _data.length === 0) {
            switch (type) {
                case 'LIKED':
                    return (
                        <View style={styles.postViewEmptyMsg}>
                            <Icon name='ios-heart-outline' style={{ fontSize: 32 }} />
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>{`${title} liked posts`}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300' }}>{`The posts liked will appear on ${title} profile`}</Text>
                        </View>
                    );
                case 'MENTIONED':
                    return (
                        <View style={styles.postViewEmptyMsg}>
                            <Icon name='ios-at-outline' style={{ fontSize: 32 }} />
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>{`${title} shared posts`}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300', textAlign: 'center' }}>{`The posts shared or mentioned \nwill appear on ${title} profile`}</Text>
                        </View>
                    );
                default:
                    return (
                        <View style={styles.postViewEmptyMsg}>
                            <Icon name='ios-camera' style={{ fontSize: 32 }} />
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>{`${title} created posts`}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '300' }}>{`The created photos will appear on ${title} profile page`}</Text>
                        </View>
                    );
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

    normalizeData = () => {
        const { dataSource, numColumns } = this.props;
        const { data } = this.state;
        let inputData = dataSource ? dataSource : data;
        if (inputData.length > 0 && inputData.length < numColumns) {
            while (inputData.length < numColumns) {
                inputData.push({
                    _id: `empty-${inputData.length}`,
                    type: 'empty'
                })
            }
            return inputData;
        }
        return inputData;
    }

    renderPostGridView = () => {
        const { numColumns } = this.props;
        if (this.state.loading) {
            return (<View style={styles.errorMsgView}><BallIndicator /></View>);
        } else {
            if (this.state.error) {
                return (<View style={styles.errorMsgView}><Text>{this.state.error}</Text></View >);
            }
            return (
                <FlatList
                    data={this.normalizeData()}
                    style={{ backgroundColor: '#fff', width: '100%', flex: 1 }}
                    renderItem={({ item }) => (
                        <PostGridViewImage dataSource={item} numColumns={numColumns} />
                    )}
                    horizontal={false}
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
            <View style={[styles.container, { opacity: this.state.opacity, zIndex: this.state.zIndex }]}>
                {this.renderPostGridView()}
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchPosts: (caller, dataSource, userId, type, limit) => dispatch(getClientProfilePosts(caller, dataSource, userId, type, limit))
})

export default connect(null, mapDispatchToProps, null, { withRef: true })(LikedPostsGridView);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff'
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
