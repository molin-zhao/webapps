import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ProfilePage from '../pages/Profile/Profile';
import ProfileSettingPage from '../pages/Profile/ProfileSetting';

export default ProfileStackNavigator = createStackNavigator({
    Profile: ProfilePage,
    Settings: ProfileSettingPage
});

