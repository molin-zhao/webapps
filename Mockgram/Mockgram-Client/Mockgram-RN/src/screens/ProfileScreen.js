import { createStackNavigator } from 'react-navigation';
import ProfilePage from '../pages/Profile/Profile';
import ProfileSettingPage from '../pages/Profile/ProfileSetting';
import PostDetail from '../pages/Profile/PostDetail';
import UserList from '../pages/Profile/UserList';

export default ProfileStackNavigator = createStackNavigator({
    Profile: ProfilePage,
    Settings: ProfileSettingPage,
    PostDetail: PostDetail,
    UserList: UserList
});

