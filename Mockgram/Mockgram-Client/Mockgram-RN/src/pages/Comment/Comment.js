import CommentPage from './CommentPage';
import CommentDetail from './CommentDetail';
import { createStackNavigator } from 'react-navigation';
export default CommentNavigator = createStackNavigator({
    CommentPage: CommentPage,
    CommentDetail: CommentDetail
}, {
        headerMode: 'none'
    })