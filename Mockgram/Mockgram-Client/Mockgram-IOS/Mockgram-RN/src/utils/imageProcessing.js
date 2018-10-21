import { ImageManipulator } from 'expo';
import window from './getWindowSize';
export default processImage = async (imageUrl) => {
    let processedImage = await ImageManipulator.manipulate(imageUrl, [{ resize: { width: window.width, height: window.width } }], { format: 'jpeg' })
    return processedImage;
}