import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';

// Importa tus pantallas de visitante
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import BusinessDetailsScreen from '../screens/BusinessDetailsScreen';
import BusinessListScreen from '../screens/BusinessListScreen';

// Importa las pantallas de autenticación
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Importa el nuevo componente AuthButton
import AuthButton from '../components/AuthButton'; // <-- ¡NUEVA IMPORTACIÓN!

const Stack = createNativeStackNavigator<RootStackParamList>();

// Pila para usuarios "Visitantes" (no logueados) y "Clientes" (logueados)
export default function VisitorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true, // Encabezados visibles por defecto
        headerStyle: {
          backgroundColor: '#f5f5f5', // Color de fondo del encabezado
        },
        headerTintColor: '#333', // Color del texto del encabezado
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerShadowVisible: false, // Quita la sombra del encabezado si no la quieres
      }}
      initialRouteName="Home" // La pantalla inicial para visitantes es Home
    >
      {/* Pantalla Home con el botón de autenticación en el header */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio', // Título para la barra de navegación
          headerRight: () => <AuthButton />, // <-- ¡AQUÍ COLOCAMOS EL BOTÓN!
        }}
      />
      <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categorías' }} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} options={{ title: 'Detalles del Negocio' }} />
      <Stack.Screen name="BusinessList" component={BusinessListScreen} options={({ route }) => ({ title: route.params?.categoryName || 'Negocios' })} />

      {/* Pantallas de Autenticación - accesibles desde cualquier lugar en VisitorStack */}
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
