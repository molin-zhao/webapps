import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-elements';
import ProfileEmbeddedTabView from './Profile/ProfileEmbeddedTabView';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

    }

    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('user').avatar,
        headerRight: (
            <TouchableOpacity style={{ marginRight: 20 }}
                onPress={() => {
                    navigation.navigate('Settings');
                }}>
                <Icon name='cog' size={24} />
            </TouchableOpacity>
        )
    });
    render() {
        return (
            <View style={styles.container}>
                <Avatar
                    large
                    rounded
                    icon={{ name: 'user', type: 'font-awesome' }}
                    activeOpacity={0.7}
                    containerStyle={{ marginTop: 30 }}
                />
                <View style={styles.count}>
                    <View style={styles.count_subview}>
                        <Text style={styles.count_text}>0</Text>
                        <Text style={styles.count_text}>Posts</Text>
                    </View>
                    <View style={styles.count_subview}>
                        <Text style={styles.count_text}>0</Text>
                        <Text style={styles.count_text}>Follow</Text>
                    </View>
                    <View style={styles.count_subview}>
                        <Text style={styles.count_text}>0</Text>
                        <Text style={styles.count_text}>Follower</Text>
                    </View>
                </View>
                <View style={styles.bio}>
                    <Text style={styles.bio_text}>This is for bio...</Text>
                </View>
                <View style={styles.embeddedTabView}>
                    <ProfileEmbeddedTabView />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    count: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50
    },
    count_subview: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    count_text: {
        fontSize: 15
    },
    bio: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50
    },
    bio_text: {
        fontSize: 12
    },
    embeddedTabView: {
        marginTop: 20,
    }
});