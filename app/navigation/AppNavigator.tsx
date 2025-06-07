// app/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Importa getDoc para leer el rol
import { auth, db } from '../../config/firebaseConfig'; // Asegúrate de que estas rutas sean correctas

// Importa las pilas de roles
import VisitorStack from './VisitorStack'; // Para visitantes y clientes logueados
import { BusinessStack } from './BusinessStack'; // Para negocios logueados

import { RootStackParamList } from './RootStackParamList'; // Importa los tipos de rutas

export default function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'business' | null>(null); // Estado para el rol
  const [loadingAuth, setLoadingAuth] = useState(true); // Estado para la carga de autenticación

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Si el usuario está logueado, intenta obtener su rol de Firestore
        try {
          const clientDocRef = doc(db, 'clients', firebaseUser.uid);
          const businessDocRef = doc(db, 'businesses', firebaseUser.uid);

          const clientDocSnap = await getDoc(clientDocRef);
          const businessDocSnap = await getDoc(businessDocRef);

          if (clientDocSnap.exists()) {
            setUserRole('client');
          } else if (businessDocSnap.exists()) {
            setUserRole('business');
          } else {
            // Si el usuario está logueado pero no se encuentra en ninguna colección de rol,
            // podrías redirigirlo a una pantalla para que elija su rol, o asignarle un rol por defecto.
            // Por ahora, lo trataremos como cliente por defecto.
            console.warn("Usuario autenticado sin rol definido en Firestore. Asignando rol 'client'.");
            setUserRole('client');
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
          setUserRole('client'); // Fallback en caso de error
        }
      } else {
        setUserRole(null); // No hay usuario, no hay rol
      }
      setLoadingAuth(false); // La carga de autenticación y rol ha terminado
    });

    return () => unsubscribe(); // Limpia el listener al desmontar
  }, []);

  if (loadingAuth) {
    // Pantalla de carga mientras se verifica el estado de autenticación y el rol
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando aplicación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Si el usuario no está logueado, o si es un cliente logueado, muestra el VisitorStack */}
      {/* Si el usuario es un negocio logueado, muestra el BusinessStack */}
      {user && userRole === 'business' ? <BusinessStack /> : <VisitorStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});
