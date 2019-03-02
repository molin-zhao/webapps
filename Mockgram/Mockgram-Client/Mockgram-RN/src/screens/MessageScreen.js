import MessageTabView from '../pages/message/MessageTabView';
import FollowingMessageDetail from '../pages/message/FollowingMessageDetail';

import { createStackNavigator } from 'react-navigation';

export default MessageStackNavigator = createStackNavigator({
    MessageTabView: MessageTabView,
    FollowingMessageDetail: FollowingMessageDetail
})

