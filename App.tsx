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
import CreateFarms from './components/CreateFarms';
import DetailsFarms from './components/DetailsFarms';
import CreatePlot from './components/CreatePlot';
import ViewPlots from './components/ViewPlots';
import ViewWorkers from './components/ViewWorkers';
import AssociateWorkers from './components/AssociateWorkers';
import DetailsWorks from './components/DetailsWorks';
import ViewAssignedTasks from './components/ViewAssignedTasks';
import AssignTask from './components/AssignTask';
import MyTask from './components/MyTask';
import DetailsTask from './components/DetailsTask';
import VerifyAcount from './components/VerifiyAcount';
import ViewCrops from './components/ViewCrops';
import CreateCrops from './components/CreateCrops';
import TaskDetail from './components/TaskDetail';
import { TermsAndConditions } from './components/TermsAndConditions';
import TaskForUsers from './components/TaskForUsers';
import TaskListForFarm from './components/TaskListForFarm';

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
        <Stack.Screen name="CreateFarms" component={CreateFarms} options={{headerShown: false}}/>
        <Stack.Screen name="DetailsFarms" component={DetailsFarms} options={{headerShown: false}}/>
        <Stack.Screen name="CreatePlot" component={CreatePlot} options={{headerShown: false}}/>
        <Stack.Screen name="ViewPlots" component={ViewPlots} options={{headerShown: false}}/>
        <Stack.Screen name="ViewWorkers" component={ViewWorkers} options={{headerShown: false}}/>
        <Stack.Screen name="AssociateWorkers" component={AssociateWorkers} options={{headerShown: false}}/>
        <Stack.Screen name="DetailsWorks" component={DetailsWorks} options={{headerShown: false}}/>
        <Stack.Screen name="ViewAssignedTasks" component={ViewAssignedTasks} options={{headerShown: false}}/>
        <Stack.Screen name="AssignTask" component={AssignTask} options={{headerShown: false}}/>
        <Stack.Screen name="MyTask" component={MyTask} options={{headerShown: false}}/>
        <Stack.Screen name="DetailsTask" component={DetailsTask} options={{headerShown: false}}/>
        <Stack.Screen name="VerifyAcount" component={VerifyAcount} options={{headerShown: false}}/>
        <Stack.Screen name="ViewCrops" component={ViewCrops} options={{headerShown: false}}/>
        <Stack.Screen name="CreateCrops" component={CreateCrops} options={{headerShown: false}}/>
        <Stack.Screen name="TaskDetail" component={TaskDetail} options={{headerShown: false}}/>
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{headerShown: false}}/>
        <Stack.Screen name="TaskForUsers" component={TaskForUsers} options={{headerShown: false}}/>
        <Stack.Screen name="TaskListForFarm" component={TaskListForFarm} options={{headerShown: false}}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
