// app/navigation/BusinessStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BusinessDashboardScreen from '../screens/BusinessDashboardScreen';

const Stack = createNativeStackNavigator();

export function BusinessStack() {
  return (
    <Stack.Navigator initialRouteName="BusinessDashboard">
      <Stack.Screen name="BusinessDashboard" component={BusinessDashboardScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
