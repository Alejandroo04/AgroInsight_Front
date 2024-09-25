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
import HomeAdmin from './components/HomeAdmin';
import SettingsCount from './components/SettingsCount';
import ViewFarms from './components/ViewFarms';
import CustomDrawerContent from './components/CustomDrawerContent';

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
        <Stack.Screen name="HomeAdmin" component={HomeAdmin} options={{headerShown: false}}/>
        <Stack.Screen name="SettingsCount" component={SettingsCount} options={{headerShown: false}}/>
        <Stack.Screen name="ViewFarms" component={ViewFarms} options={{headerShown: false}}/>
        <Stack.Screen name="CustomDrawerContent" component={CustomDrawerContent} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
