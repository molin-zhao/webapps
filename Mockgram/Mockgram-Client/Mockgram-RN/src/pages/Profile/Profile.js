import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';

import ProfileTabView from './ProfileTabView';
import Icon from 'react-native-vector-icons/Ionicons';
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
        title: navigation.getParam('title', 'username'),
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
        const { navigation, profile } = this.props;
        if (profile) {
            navigation.setParams({
                title: profile.username
            })
        }
    }

    onRefresh = () => {
        this.setState({
            refreshing: true
        });
    }

    render() {
        const { initialProfile } = this.state;
        const { profile, navigation } = this.props;
        let userProfile = profile ? profile : initialProfile;
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
                {userProfile.avatar ?
                    <Avatar
                        large
                        rounded
                        source={{ uri: userProfile.avatar }}
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
                        <Text style={styles.countText}>{userProfile.postCount}</Text>
                        <Text style={styles.countText}>Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.countSubview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.countText}>{userProfile.followingCount}</Text>
                        <Text style={styles.countText}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.countSubview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.countText}>{userProfile.followerCount}</Text>
                        <Text style={styles.countText}>Follower</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bio}>
                    <Text style={styles.bioText}>{userProfile.bio}</Text>
                </View>
                <View style={styles.embeddedTabView}>
                    <ProfileTabView navigation={navigation} userId={userProfile._id} clientUpdate={true} numColumns={3} />
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
        profile: state.profile.profile,
    }
}
export default connect(mapStateToProps, null)(Profile)