import { createStackNavigator } from "react-navigation";
import Profile from "../pages/Profile";
import ProfileSetting from "../pages/Profile/ProfileSetting";
import LanguageSetting from "../pages/Profile/LanguageSetting";

export default createStackNavigator(
  {
    Profile,
    ProfileSetting,
    LanguageSetting
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
