import { createStackNavigator } from 'react-navigation';
import ImageFilter from '../pages/Post/ImageFilterPage';
import PostPreview from '../pages/Post/PostPreview';

export default ImageFilterNavigator = createStackNavigator({
    ImageFilter,
    PostPreview
}, {
        headerMode: 'none'
    })