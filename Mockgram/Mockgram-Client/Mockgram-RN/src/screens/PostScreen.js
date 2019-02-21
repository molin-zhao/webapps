import React from 'react';
import { createStackNavigator } from 'react-navigation';
import PostTabView from '../pages/Post/PostTabView';
import PostPreview from '../pages/Post/PostPreview';
import ImageFilter from '../pages/Post/ImageFilterPage';

export default PostStackNavigator = createStackNavigator({
    PostTabView: PostTabView,
    PostPreview: PostPreview,
    ImageFilter: ImageFilter

})