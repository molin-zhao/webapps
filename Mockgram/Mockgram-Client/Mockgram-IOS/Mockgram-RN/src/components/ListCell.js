import React from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, Button } from 'react-native';
import window from '../utils/getWindowSize';
import { CardItem, Left, Thumbnail, Body, Right } from 'native-base';

export default class ListCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSearching: false,
            dataSource: [
                {
                    _id: '0',
                    avatar: '',
                    username: 'momo',
                    nickname: 'mooooore'
                },
                {
                    _id: '1',
                    avatar: '',
                    username: 'university of melbourne',
                    nickname: 'unimelb'
                }
            ],
            refreshing: false,

        }
    }

    sayHello = (index) => {
        console.log('Hello world from ' + index);
    }

    renderPeopleList = () => {
        if (this.state.isSearching) {
            return (
                <View style={{ marginTop: 10, height: 50, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'lightgrey' }}>Searching for {this.state.searchValue} ...</Text>
                    <ActivityIndicator size='small' color='lightgrey' />
                </View>
            );
        } else {
            return (<FlatList
                data={this.state.dataSource}
                keyExtractor={item => item._id}
                style={{ width: window.width, marginTop: 0 }}
                renderItem={({ item }) => {
                    return (<CardItem style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1, width: window.width, height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <Left style={{ flex: 4 }}>
                            <Thumbnail source={item.avatar === '' ? require('../static/user.png') : {
                                uri: item.avatar
                            }} />
                            <Body>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.username}</Text>
                                <Text>{item.nickname}</Text>
                            </Body>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            <Button style={{ backgroundColor: 'blue', fontSize: 10, height: 35, width: 70 }} title='follow' onPress={() => {
                                console.log('follow ' + item._id);
                            }} />
                        </Right>
                    </CardItem>);
                }}
            />);
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <this.renderPeopleList />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    }
})