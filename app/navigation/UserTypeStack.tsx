// app/navigation/UserTypeStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserTypeSelectorScreen from '../screens/UserTypeSelectorScreen';

const Stack = createNativeStackNavigator();

export default function UserTypeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTypeSelector" component={UserTypeSelectorScreen} />
    </Stack.Navigator>
  );
}