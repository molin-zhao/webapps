import { ImageManipulator } from "expo";
import window from "./getDeviceInfo";
export default (processImage = async imageUrl => {
  let processedImage = await ImageManipulator.manipulateAsync(
    imageUrl,
    [{ resize: { width: window.width, height: window.width } }],
    { format: "jpeg" }
  );
  return processedImage;
});
