import React from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import baseUrl from '../../common/baseUrl';
import renderImageList from '../../components/ImageGridList';

export default class MyProfileListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            isRefreshing: false,
            loadMore: false,
            hasMore: true,
            passedParam: this.props.passedParam,
            passedId: this.props.passedId,
            lastItem: null,
            testData: [
                { _id: 0, image: require('../../test/hou.png') },
                { _id: 1, image: require('../../test/maozi.png') },
                { _id: 2, image: require('../../test/mingyu.png') },
                { _id: 3, image: require('../../test/weiyingluo.png') },
                { _id: 4, image: require('../../test/xiaogang.png') }
            ]
        }
    }

    async getData() {
        await fetch(`${baseUrl.api}/user/profile/posts/${this.state.passedParam}/${this.state.passedId}/${this.state.lastItem}`);
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {renderImageList(this.state.testData, windowWidth, 3, () => {
                    console.log('pressed');
                })}
            </View>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
});