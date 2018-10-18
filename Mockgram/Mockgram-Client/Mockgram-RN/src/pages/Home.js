import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import PostCardComponent from '../components/PostCardComponent';

const post = {
    image: require('../test/weiyingluo.png'),
    postBy: {
        image: require('../test/mingyu.png'),
        username: '明玉',
    },
    location: {
        name: 'unimelb'
    },
    description: '这是明玉',
    likes: 202
}
export default class Home extends React.Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <PostCardComponent dataSource={post} />
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});