import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList'; // Importa tus tipos
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

type AuthButtonNavigationProp = NativeStackNavigationProp<RootStackParamList>; // Puede ser cualquier ruta

export default function AuthButton() {
  const navigation = useNavigation<AuthButtonNavigationProp>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Escuchar el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Sesión cerrada exitosamente.");
      // Firebase onAuthStateChanged en AppNavigator se encargará de la redirección
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Inténtalo de nuevo."); // Usar alert solo para desarrollo/depuración
    }
  };

  if (currentUser) {
    return (
      <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.authButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="person-circle-outline" size={20} color="#fff" />
        <Text style={styles.authButtonText}>Iniciar Sesión / Registrarse</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  authButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    // Eliminado: position: 'absolute', top, right porque ahora lo gestiona el headerRight
  },
  authButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
