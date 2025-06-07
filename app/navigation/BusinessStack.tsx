    // app/navigation/BusinessStack.tsx
    import { createNativeStackNavigator } from '@react-navigation/native-stack';
    import BusinessDashboardScreen from '../screens/BusinessDashboardScreen'; // Asegúrate de que esta ruta sea correcta
    import { RootStackParamList } from './RootStackParamList'; // Importa desde el archivo centralizado

    const Stack = createNativeStackNavigator<RootStackParamList>();

    // Esta pila es para usuarios con rol de "Negocio" (ya autenticados)
    // Es importante que sea 'export function' y no 'export default'
    export function BusinessStack() {
      return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="BusinessDashboard" component={BusinessDashboardScreen} options={{ title: 'Panel de Negocio' }} />
        </Stack.Navigator>
      );
    }
    