import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import BusinessDetailsScreen from '../screens/BusinessDetailsScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Categories: undefined;
  BusinessDetails: { id: string };
  BusinessList: { categoryId: string; categoryName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Pila para negocios que aún no han iniciado sesión
export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// ✅ Nueva función exportada: AppStack (para usuarios logueados)
export function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="BusinessList" component={BusinessListScreen} />
    </Stack.Navigator>
  );
}
