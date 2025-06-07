// app/navigation/MainAppStack.tsx (NUEVO ARCHIVO: Crea este archivo)
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig'; // Asegúrate de que estas rutas sean correctas
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Importa las pilas específicas de roles
import VisitorStack from './VisitorStack';
import { BusinessStack } from './BusinessStack'; // Asegúrate de que BusinessStack se exporte como named export

import { RootStackParamList } from './RootStackParamList'; // Importa desde el archivo centralizado

const Stack = createNativeStackNavigator<RootStackParamList>();

// Esta pila se renderiza UNA VEZ que el usuario está autenticado.
// Aquí decidimos qué flujo de la aplicación mostrar según el rol del usuario.
export default function MainAppStack() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        try {
          // Asume que tienes una colección 'users' o 'businesses' donde guardas el rol
          // Aquí un ejemplo que busca en 'businesses' si el usuario es un negocio
          const businessDocRef = doc(db, 'businesses', auth.currentUser.uid);
          const businessDocSnap = await getDoc(businessDocRef);

          if (businessDocSnap.exists()) {
            // Si el documento existe en 'businesses', asumimos que es un negocio
            // Podrías tener un campo 'role' en el documento para ser más explícito
            setUserRole('business');
          } else {
            // Si no está en 'businesses', asumimos que es un visitante (o usuario general)
            setUserRole('visitor');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('visitor'); // Fallback a visitante en caso de error
        }
      }
      setLoadingRole(false);
    };

    fetchUserRole();
  }, [auth.currentUser]); // Se ejecuta cuando el usuario de auth cambia

  if (loadingRole) {
    // Muestra una pantalla de carga mientras se determina el rol del usuario
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Determinando tu rol...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === 'business' ? (
        <Stack.Screen name="BusinessStack" component={BusinessStack} />
      ) : (
        <Stack.Screen name="VisitorStack" component={VisitorStack} />
      )}
    </Stack.Navigator>
  );
}

// Estilos para la pantalla de carga de rol
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