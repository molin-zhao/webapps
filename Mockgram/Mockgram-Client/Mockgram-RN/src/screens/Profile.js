import { createStackNavigator } from "react-navigation";
import Profile from "../pages/Profile";
import ProfileSetting from "../pages/Profile/ProfileSetting";

export default createStackNavigator(
  {
    Profile,
    ProfileSetting
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
