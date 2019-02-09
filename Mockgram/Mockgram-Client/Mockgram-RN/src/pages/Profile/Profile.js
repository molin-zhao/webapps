import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';

import ProfileTabView from './ProfileTabView';
import Icon from 'react-native-vector-icons/Ionicons';
import { getClientProfile } from '../../redux/actions/profileActions';
import window from '../../utils/getDeviceInfo';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialProfile: {
                avatar: '',
                postCount: 0,
                followerCount: 0,
                followingCount: 0,
                bio: 'no bio yet',
            },
            refreshing: false,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('title', null),
        headerRight: (
            <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 20 }}
                onPress={() => {
                    navigation.navigate('Settings');
                }}>
                <Icon name='ios-settings' size={24} />
            </TouchableOpacity>
        )
    });

    componentDidMount() {
        const { navigation, client, getClientProfile } = this.props;
        if (client) {
            getClientProfile(client.token).then(profile => {
                navigation.setParams({
                    title: profile.username
                })
            }).catch(err => {
                console.log(err);
            });
        }
    }

    onRefresh = () => {
        let that = this;
        this.setState({
            refreshing: true
        }, () => {
            setTimeout(() => {
                that.setState({
                    refreshing: false
                })
            }, 2000)
        })
    }

    render() {
        let profile = this.props.profile ? this.props.profile : this.state.initialProfile;
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
                horizontal={false}
            >
                {profile.avatar && profile.avatar !== '' ?
                    <Avatar
                        large
                        rounded
                        source={{ uri: profile.avatar }}
                        activeOpacity={0.7}
                        containerStyle={{ marginTop: 30 }}
                    /> :
                    <Avatar
                        large
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        activeOpacity={0.7}
                        containerStyle={{ marginTop: 30 }}
                    />
                }

                <View style={styles.count}>
                    <TouchableOpacity
                        style={styles.countSubview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.countText}>{profile.postCount}</Text>
                        <Text style={styles.countText}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.countSubview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.countText}>{profile.followingCount}</Text>
                        <Text style={styles.countText}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.countSubview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.countText}>{profile.followerCount}</Text>
                        <Text style={styles.countText}>Follower</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bio}>
                    <Text style={styles.bioText}>{profile.bio}</Text>
                </View>
                <View style={styles.embeddedTabView}>
                    <ProfileTabView navigation={this.props.navigation} userId={profile._id} clientUpdate={true} numColumns={3} />
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    count: {
        marginTop: 20,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: window.height * 0.1
    },
    countSubview: {
        width: '30%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        alignSelf: 'center',
        fontSize: 15
    },
    bio: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    bioText: {
        fontSize: 12
    },
    embeddedTabView: {
        marginTop: 20,
    }
});

const mapStateToProps = state => {
    return {
        client: state.client.client,
        profile: state.profile.profile,
    }
}

const mapDispatchToProps = dispatch => ({
    getClientProfile: (token) => dispatch(getClientProfile(token))
})
export default connect(mapStateToProps, mapDispatchToProps)(Profile)