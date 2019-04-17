import { createStackNavigator } from "react-navigation";
import Message from "../pages/message";
import FollowingMessageDetail from "../pages/message/FollowingMessageDetail";

export default createStackNavigator(
  {
    Message,
    FollowingMessageDetail
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
