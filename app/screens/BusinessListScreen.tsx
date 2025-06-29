// app/screens/BusinessListScreen.tsx (MODIFICADO)
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList'; // Asegúrate que esta importación sea correcta
import { collection, query, where, getDocs } from 'firebase/firestore'; // Importa para consultas en Firestore
import { db } from '../../config/firebaseConfig'; // Importa tu instancia de Firestore

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessList'>;

// Define la estructura de los datos del negocio tal como se guardan en Firestore
interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  latitude: number;
  longitude: number;
  category: string; // Asegúrate que este campo existe en Firestore
  // Puedes añadir más campos si los tienes en Firestore (ej. email, fullName, role)
}

export default function BusinessListScreen({ route, navigation }: Props) {
  const { categoryId, categoryName } = route.params; // Obtenemos el ID y nombre de la categoría
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessesByCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Crear una consulta para la colección 'businesses'
        // y filtrar por el campo 'category' que coincida con categoryId
        const businessesRef = collection(db, 'businesses');
        const q = query(businessesRef, where('category', '==', categoryId));

        const querySnapshot = await getDocs(q);
        const businessesList: Business[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            hours: data.hours,
            image: data.image,
            latitude: data.latitude,
            longitude: data.longitude,
            category: data.category,
          };
        });
        setBusinesses(businessesList);
      } catch (err: any) {
        console.error(`Error al cargar negocios para la categoría ${categoryName}:`, err);
        // Puedes refinar este mensaje de error si necesitas un manejo más específico de permisos
        setError(`Error al cargar negocios de ${categoryName}. Revisa tus reglas de Firestore.`);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessesByCategory();
  }, [categoryId, categoryName]); // Se re-ejecuta si la categoría cambia

  const renderBusinessItem = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => navigation.navigate('BusinessDetails', { id: item.id })}
    >
      {/* Puedes añadir una imagen del negocio aquí si lo deseas, usando item.image */}
      <Text style={styles.businessName}>{item.name}</Text>
      <Text style={styles.businessDescription}>{item.description}</Text>
      <Text style={styles.businessAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando negocios de {categoryName}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Negocios de {categoryName}</Text>
      {businesses.length === 0 ? (
        <Text style={styles.noBusinessesText}>No hay negocios disponibles en esta categoría.</Text>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.id}
          renderItem={renderBusinessItem}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  listContentContainer: {
    paddingBottom: 20, // Para asegurar que el último elemento no se corte
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  businessDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  businessAddress: {
    fontSize: 13,
    color: '#888',
  },
  noBusinessesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});