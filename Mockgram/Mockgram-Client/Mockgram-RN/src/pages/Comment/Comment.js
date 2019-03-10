import CommentPage from './CommentPage';
import CommentDetail from './CommentDetailPage';
import LikedUserPage from './LikedUser';

import { createStackNavigator } from 'react-navigation';

export default CommentNavigator = createStackNavigator({
    CommentPage: CommentPage,
    CommentDetail: CommentDetail,
    LikedUser: LikedUserPage
}, {
        headerMode: 'none'
    })