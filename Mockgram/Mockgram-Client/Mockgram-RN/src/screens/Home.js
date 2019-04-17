import { createStackNavigator } from "react-navigation";
import Home from "../pages/Home";

export default createStackNavigator(
  {
    Home
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
