import React, { useEffect, useState } from "react"; // Importa useEffect y useState
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Button,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator // Para el indicador de carga
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootStackParamList"; // Asegúrate que esta importación sea correcta
import { doc, getDoc } from 'firebase/firestore'; // Importa para consultas en Firestore
import { db } from '../../config/firebaseConfig'; // Importa tu instancia de Firestore
import MapView, { Marker } from "react-native-maps";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessDetails">;

// Define la estructura esperada del negocio desde Firestore
interface Business {
  id: string; // El UID del usuario/negocio en Firestore
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  image: string; // URL de la imagen
  latitude: number;
  longitude: number;
  category: string;
  // Añade aquí cualquier otro campo que guardes en Firestore para el negocio
}

export default function BusinessDetailsScreen({ route }: Props) {
  const { id } = route.params; // El 'id' es el UID del negocio en Firestore
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const businessDocRef = doc(db, 'businesses', id); // Referencia al documento del negocio
        const businessDocSnap = await getDoc(businessDocRef);

        if (businessDocSnap.exists()) {
          const businessData = businessDocSnap.data() as Omit<Business, 'id'>; // <-- RENOMBRAMOS A businessData
          console.log("BusinessDetailsScreen: Datos encontrados para ID", id, businessData); // <-- USAMOS businessData
           setBusiness({ id: businessDocSnap.id, ...businessData }); // Guarda el ID y los datos
        } else {
          setBusiness(null); // No se encontró el negocio
        }
      } catch (err: any) {
        console.error(`Error al cargar detalles del negocio ${id}:`, err);
        setError("Error al cargar los detalles del negocio. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]); // Dependencia del useEffect, se re-ejecuta si el ID del negocio cambia

  const openPhone = () => {
    if (business?.phone) {
      Linking.openURL(`tel:${business.phone}`).catch(() =>
        Alert.alert("Error", "No se pudo abrir la app de llamadas")
      );
    }
  };

  const openWhatsApp = () => {
    if (business?.phone) {
      // Asume que el número de teléfono ya incluye el código de país o que es un número local en MX (+52)
      Linking.openURL(`https://wa.me/52${business.phone}`).catch(() => // Se asume +52 para México
        Alert.alert("Error", "No se pudo abrir WhatsApp")
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Cargando detalles del negocio...</Text>
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

  if (!business) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Negocio no encontrado</Text>
        <Text style={styles.info}>El negocio que buscas no existe o fue eliminado.</Text>
      </View>
    );

    console.log("BusinessDetailsScreen: Datos encontrados para ID", id, data);
  }

  

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: business.image || 'https://placehold.co/600x400/E0E0E0/333333?text=Sin+Imagen' }} // Placeholder si no hay imagen
        style={styles.image}
      />

      <Text style={styles.title}>{business.name}</Text>
      <Text style={styles.description}>{business.description}</Text>

      <Text style={styles.label}>📍 Dirección</Text>
      <Text style={styles.info}>{business.address}</Text>

      <Text style={styles.label}>⏰ Horario</Text>
      <Text style={styles.info}>{business.hours}</Text>

      <Text style={styles.label}>📞 Teléfono</Text>
      <Text style={styles.info}>{business.phone}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Llamar" onPress={openPhone} />
        <View style={{ height: 10 }} />
        <Button title="Enviar WhatsApp" onPress={openWhatsApp} />
      </View>

      {/* Solo muestra el mapa si hay latitud y longitud válidas */}
      {business.latitude && business.longitude ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: business.latitude,
            longitude: business.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: business.latitude,
              longitude: business.longitude,
            }}
            title={business.name}
            description={business.address}
          />
        </MapView>
      ) : (
        <Text style={styles.infoMap}>Ubicación no disponible.</Text>
      )}


      {/* Sección de Opiniones (manteniendo la estructura actual) */}
      <Text style={styles.label}>⭐ Opiniones</Text>
      {/* Actualmente reviewsData es local, esto necesitará una adaptación para Firestore */}
      {/* Por ahora, muestra un mensaje simple o integra la carga de reseñas si ya la tienes */}
      <Text style={styles.info}>Funcionalidad de reseñas en desarrollo.</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  container: { // Este estilo se usa para el caso "Negocio no encontrado"
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 15,
    color: "#444",
    marginBottom: 10,
  },
  infoMap: { // Nuevo estilo para mensaje si no hay mapa
    fontSize: 15,
    color: "#888",
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'column', // Los botones se apilan verticalmente
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  map: {
    height: 200,
    width: "100%",
    borderRadius: 12,
    marginTop: 20,
  },
  reviewCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  reviewUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewRating: {
    color: '#ffaa00',
    marginBottom: 4,
  },
  reviewComment: {
    fontStyle: 'italic',
  },
});
