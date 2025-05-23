import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import BusinessDetailsScreen from '../screens/BusinessDetailsScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import LoginScreen from '../screens/LoginScreen'; // Podrías decidir mover Login a AuthStack completamente

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Categories: undefined;
  BusinessDetails: { id: string };
  BusinessList: { categoryId: string; categoryName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VisitorStack() { // Renombrado a VisitorStack y export default
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="BusinessList" component={BusinessListScreen} />
      {/* Si decides incluir Login aquí para visitantes */}
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
    </Stack.Navigator>
  );
}