import { createStackNavigator } from "react-navigation";
import LoginPage from "./Login";
import RegisterPage from "./Register";

export default (LoginIndex = createStackNavigator({
  Login: {
    screen: LoginPage
  },
  Register: {
    screen: RegisterPage
  }
}));
