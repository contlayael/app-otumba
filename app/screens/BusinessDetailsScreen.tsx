import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Button,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { businessesData } from "../../data/businesses";
import { reviewsData } from "../../data/reviews";
import MapView, { Marker } from "react-native-maps";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessDetails">;

export default function BusinessDetailsScreen({ route }: Props) {
  const { id } = route.params;
  const business = businessesData[id];
  const reviews = reviewsData[id] || [];


  if (!business) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Negocio no encontrado</Text>
      </View>
    );
  }

  const openPhone = () => {
    Linking.openURL(`tel:${business.phone}`).catch(() =>
      Alert.alert("Error", "No se pudo abrir la app de llamadas")
    );
  };

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/52${business.phone}`).catch(() =>
      Alert.alert("Error", "No se pudo abrir WhatsApp")
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: business.image }} style={styles.image} />

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

      <Text style={styles.label}>⭐ Opiniones</Text>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewUser}>{review.username}</Text>
            <Text style={styles.reviewRating}>
              Calificación: {review.rating} ⭐
            </Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.info}>Aún no hay reseñas.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // este es CLAVE para evitar que los últimos botones se corten
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  info: { fontSize: 15, color: "#444" },
  buttonContainer: { marginTop: 30 },

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
