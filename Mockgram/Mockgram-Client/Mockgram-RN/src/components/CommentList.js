import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ViewMoreText from 'react-native-view-more-text';
import Icon from 'react-native-vector-icons/Ionicons';


import window from '../utils/getDeviceInfo';
import { dateConverter } from '../utils/unitConverter';

export default class CommentList extends React.Component {
    constructor(props) {
        super(props)
    }

    renderTag = (dataSource) => {
        if (dataSource.commentByPostCreator) {
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 5, height: 16, width: 48, borderRadius: 8, backgroundColor: '#eb765a' }}>
                    <View style={{ height: 10, width: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="md-ribbon" style={{ fontSize: 12, color: '#fff' }} />
                    </View>
                    <Text style={{ fontSize: 9, color: '#fff' }}>creator</Text>
                </View>
            );
        }
        return null;
    }

    render() {
        const { dataSource, navigation } = this.props;
        return (
            <View key={dataSource._id} style={styles.container}>
                <View style={styles.userAvatar}>
                    <Image style={{ height: 20, width: 20, borderRadius: 10 }} source={dataSource.commentBy.avatar === '' ? require('../static/user.png') : {
                        uri: dataSource.commentBy.avatar
                    }} />
                </View>
                <View style={styles.contents}>
                    <View style={styles.username}>
                        <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                            {dataSource.commentBy.username}
                        </Text>
                        {this.renderTag(dataSource)}
                    </View>
                    <View style={styles.commentContents}>
                        <ViewMoreText
                            numberOfLines={1}
                            renderViewMore={(onPress) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                        <Text style={{ color: '#4696EC' }} onPress={onPress}>{`show more `}<Icon name="md-arrow-dropdown" /></Text>
                                    </TouchableOpacity>);

                            }}
                            renderViewLess={(onPress) => {
                                return (
                                    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ marginTop: 2, height: 15, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                                        <Text style={{ color: '#4696EC' }}>{`show less `}<Icon name="md-arrow-dropup" /></Text>
                                    </TouchableOpacity>);
                            }}
                        >

                            <Text style={{ fontWeight: 'normal' }}>
                                {dataSource.content}
                            </Text>
                        </ViewMoreText>
                    </View>
                    <View style={styles.commentMeta}>
                        <Text style={{ fontSize: 12, color: 'grey' }}>{dateConverter(dataSource.createdAt)}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey'
    },

    userAvatar: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    contents: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
    },
    commentContents: {
        width: '95%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    commentMeta: {
        width: '95%',
        height: 20,
        marginTop: 2,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    username: {
        width: '95%',
        height: 20,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
})