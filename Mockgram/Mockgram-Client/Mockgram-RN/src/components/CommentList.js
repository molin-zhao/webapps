import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Body, Thumbnail } from 'native-base';
import ViewMoreText from 'react-native-view-more-text';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CommentList extends React.Component {
    render() {
        const { dataSource, navigation } = this.props;
        return (
            <View key={dataSource._id} style={{ height: 50, width: "100%" }}>
                <View>
                    <Thumbnail source={this.state.dataSource.postUser.avatar === '' ? require('../static/user.png') : {
                        uri: this.state.dataSource.postUser.avatar
                    }} />
                </View>
                <View>
                    <Body>
                        <View>
                            <ViewMoreText
                                numberOfLines={2}
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
                                <Text style={{ fontWeight: "bold" }}>
                                    {this.state.dataSource.postUser.username}
                                    <Text style={{ fontWeight: 'normal' }}>
                                        {`  ${this.state.dataSource.description}`}
                                    </Text>
                                </Text>
                            </ViewMoreText>
                        </View>
                    </Body>
                </View>
            </View>
        );
    }
}