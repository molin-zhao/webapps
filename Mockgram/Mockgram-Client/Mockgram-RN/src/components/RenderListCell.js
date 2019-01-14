import React from 'react';
import { Text, View, FlatList } from 'react-native';
import UserListCell from './UserListCell';
import PostListCell from './PostListCell';
import TagListCell from './TagListCell';
import window from '../utils/getDeviceInfo';
export default class ListCell extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { dataSource, resultType, type, ...props } = this.props;
        if (dataSource.length === 0 && resultType === 'search') {
            return (<View style={{ marginTop: 10, width: window.width }}>
                <Text style={{ marginLeft: 20, fontSize: 13, color: 'lightgrey' }}>No account found.</Text>
            </View>);
        } else {
            if (resultType === 'suggest') {
                if (dataSource.length === 0) {
                    return (<View style={{ marginTop: 10, width: window.width }}>
                        <Text style={{ marginLeft: 20, fontSize: 15, fontWeight: 'bold', color: 'black' }}>Suggested</Text>
                        <Text style={{ marginLeft: 20, marginTop: 10, fontSize: 13, color: 'lightgrey' }}>No suggestions temporarily found.</Text>
                    </View>);
                }
                return (
                    <View style={{ marginTop: 10, width: window.width }}>
                        <Text style={{ marginLeft: 20, fontSize: 13, fontWeight: 'bold', color: 'black' }}>Suggested</Text>
                        <FlatList
                            data={dataSource}
                            keyExtractor={item => item._id}
                            style={{ width: window.width, marginTop: 0 }}
                            renderItem={({ item }) => {
                                if (type === 'people') {
                                    return (<UserListCell dataSource={item} />);
                                } else if (type === 'tag') {
                                    return (<TagListCell dataSource={item} />);
                                } else if (type === 'place') {
                                    return (<PostListCell dataSource={item} />);
                                } else {
                                    return (null);
                                }
                            }}
                        />
                    </View>
                );
            }
            return (<FlatList
                data={dataSource}
                keyExtractor={item => item._id}
                style={{ width: window.width, marginTop: 0 }}
                renderItem={({ item }) => {
                    if (type === 'people') {
                        return (<UserListCell dataSource={item} />);
                    } else if (type === 'tag') {
                        return (<TagListCell dataSource={item} />);
                    } else if (type === 'place') {
                        return (<PostListCell dataSource={item} />);
                    } else {
                        return (null);
                    }
                }}
            />);
        }
    }
}

ListCell.defaultProps = { resultType: 'plain' }