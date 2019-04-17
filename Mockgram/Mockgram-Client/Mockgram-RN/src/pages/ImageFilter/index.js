import { createStackNavigator } from "react-navigation";
import ImageFilter from "./ImageFilterPage";
import PostPreview from "./PostPreview";

export default (ImageFilterIndex = createStackNavigator(
  {
    // ImageFilter,
    PostPreview
  },
  {
    headerMode: "none",
    mode: "modal"
  }
));
