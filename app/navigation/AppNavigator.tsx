// app/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { BusinessStack } from './BusinessStack';
import MainStack from './MainStack'; // Importa el MainStack

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<'UserType' | 'BusinessStack'>('UserType');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        setInitialRouteName('BusinessStack');
      } else {
        setInitialRouteName('UserType');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <BusinessStack /> : <MainStack />}
    </NavigationContainer>
  );
}