import { createStackNavigator } from "react-navigation";
import Discovery from "../pages/Discovery";

export default createStackNavigator(
  {
    Discovery
  },
  {
    cardStyle: {
      backgroundColor: "#fff"
    }
  }
);
