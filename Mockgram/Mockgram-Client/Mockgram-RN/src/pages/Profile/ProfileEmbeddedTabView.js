import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native';
import { Icon } from 'native-base';
import MyLiked from './MyProfileListView';
import MyPosts from './MyProfileListView';
import MyMentioned from './MyProfileListView';

export default class ProfileEmbeddedTabView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0, // by default the first tab
            activeColor: '#eb765a',
            inactiveColor: 'black'
        }
    }

    activeStyle = index => {
        return this.state.activeIndex === index ? this.state.activeColor : this.state.inavtiveColor
    }

    tabSelected = index => {
        this.setState({
            activeIndex: index
        })
    }

    renderSection = () => {
        if (this.state.activeIndex === 0) {
            return <MyPosts />
        } else if (this.state.activeIndex === 1) {
            return <MyLiked />
        } else {
            return <MyMentioned />
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tab}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tabCell} onPress={() => this.tabSelected(0)}>
                        <Icon name="image" type="FontAwesome" style={{ color: this.activeStyle(0) }} />
                        <Text style={{ fontSize: 10, color: this.activeStyle(0) }}>Posts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tabCell} onPress={() => this.tabSelected(1)}>
                        <Icon name="heart" type="FontAwesome" style={{ color: this.activeStyle(1) }} />
                        <Text style={{ fontSize: 10, color: this.activeStyle(1) }}>Liked</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={styles.tabCell} onPress={() => this.tabSelected(2)}>
                        <Icon name="at" type="FontAwesome" style={{ color: this.activeStyle(2) }} />
                        <Text style={{ fontSize: 10, color: this.activeStyle(2) }}>Mentioned</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <this.renderSection />
                </View>
            </View>
        );
    }
}
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    tab: {
        width: windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eae5e5',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eae5e5'
    },
    tabCell: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    }
});