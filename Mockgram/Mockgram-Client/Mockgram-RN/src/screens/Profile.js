import { createStackNavigator } from "react-navigation";
import Profile from "../pages/Profile";
import Settings from "../pages/Profile/ProfileSetting";

export default createStackNavigator(
  {
    Profile,
    Settings
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
