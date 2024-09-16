import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ConfirmIdentity from './components/ConfirmIdentity';
import Verification from './components/Verification';
import Home from './components/Home';
import PasswordRecovery from './components/PasswordRecovery';
import ConfirmIdentityRecover from './components/ConfirmIdentityRecover';
import ResetPassword from './components/ResetPassword';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmIdentity" component={ConfirmIdentity} options={{ headerShown: false }} />
        <Stack.Screen name="Verification" component={Verification} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecovery} options={{headerShown: false}}/>
        <Stack.Screen name="ConfirmIdentityRecover" component={ConfirmIdentityRecover} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}}/>


      </Stack.Navigator>
    </NavigationContainer>
  );
}
