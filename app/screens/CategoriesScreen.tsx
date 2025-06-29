import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList'; // <-- CORREGIDO: Importa desde RootStackParamList
import { collection, getDocs } from 'firebase/firestore'; // Importa para cargar desde Firestore
import { db } from '../../config/firebaseConfig'; // Importa db

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

// Definición de las categorías que se usarán en toda la aplicación
// Coherente con las categorías del BusinessDashboardScreen
const APP_CATEGORIES = [
  { id: 'restaurantes', name: 'Restaurantes' },
  { id: 'servicios', name: 'Servicio' },
  { id: 'abarrotes', name: 'Abarrotes' },
  { id: 'hoteles', name: 'Hotel' },
  { id: 'estetica-barber', name: 'Estética y Barber' },
];

export default function CategoriesScreen({ navigation }: Props) {
  const [categories, setCategories] = useState<typeof APP_CATEGORIES>([]); // Usar el tipo APP_CATEGORIES
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // En un escenario real, aquí cargarías las categorías desde Firestore
        // Por ahora, usamos la lista definida localmente para coherencia
        setCategories(APP_CATEGORIES);

        // Ejemplo de cómo podrías cargar desde Firestore si tienes una colección 'categories'
        // const querySnapshot = await getDocs(collection(db, 'categories'));
        // const fetchedCategories = querySnapshot.docs.map(doc => ({
        //   id: doc.id,
        //   name: doc.data().name,
        // }));
        // setCategories(fetchedCategories);

      } catch (err) {
        console.error("Error al cargar las categorías:", err);
        setError("Error al cargar las categorías. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const renderCategoryItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BusinessList', {
          categoryId: item.id,
          categoryName: item.name,
      })}
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando categorías...</Text>
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
      <Text style={styles.title}>Categorías</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, backgroundColor: '#fff'
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20
  },
  card: {
    backgroundColor: '#e8e8e8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
  },
  loadingContainer: { // Nuevos estilos para la carga
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: { // Nuevos estilos para el error
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },

  });
