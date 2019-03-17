import React from 'react';
import { FlatList } from 'react-native';

import CommentListCellMetaReplyCell from './CommentListCellMetaReplyCell';

class CommentListCellMeta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null
        }
    }

    componentDidMount() {
        const { initData } = this.props;
        if (initData) {
            this.setState({
                data: this.state.data.concat(initData)
            })
        }
    }

    render() {
        const { creatorId } = this.props;
        return (
            <FlatList
                style={{ marginTop: 0, width: '100%', flex: 1 }}
                data={this.state.data}
                renderItem={({ item }) => (
                    <CommentListCellMetaReplyCell
                        dataSource={item}
                        creatorId={creatorId}
                    />
                )}
                ListEmptyComponent={null}
                keyExtractor={item => item._id}
            />
        );
    }
}

export default CommentListCellMeta;