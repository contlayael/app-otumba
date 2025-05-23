// app/navigation/MainStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTypeStack from './UserTypeStack';
import VisitorStack from './VisitorStack';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserType" component={UserTypeStack} />
      <Stack.Screen name="VisitorStack" component={VisitorStack} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
    </Stack.Navigator>
  );
}