import { createStackNavigator } from "react-navigation";
import Post from "../pages/Post";

export default createStackNavigator(
  {
    Post
  },
  {
    headerMode: "none",
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
