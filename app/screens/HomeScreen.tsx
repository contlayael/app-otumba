import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootStackParamList";

const promotions = [
  {
    id: "comida-1",
    title: "Tacos “El Güero”",
    image: require("../../assets/promo1.jpg"),
    description: "2x1 en tacos los martes 🌮",
  },
  {
    id: "papeleria-1",
    title: "Papelería Lupita",
    image: require("../../assets/promo2.jpg"),
    description: "10% de descuento en útiles escolares ✏️",
  },
  {
    id: "estetica-1",
    title: "Estética Rosy",
    image: require("../../assets/promo3.jpg"),
    description: "Corte y peinado por $100 💇‍♀️",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const { width } = Dimensions.get("window");

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.headerContentContainer}>
        <Text style={styles.title}>
          Descubre lo mejor de Otumba en un solo lugar
        </Text>
      </View>

      <Text style={styles.label}>🎉 Promociones</Text>

      <Carousel
        loop
        width={width}
        height={200}
        autoPlay={true}
        data={promotions}
        scrollAnimationDuration={2000}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("BusinessDetails", { id: item.id })
            }
          >
            <View style={styles.promoCard}>
              <Image source={item.image} style={styles.promoImage} />
              <Text style={styles.promoTitle}>{item.title}</Text>
              <Text style={styles.promoDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Image
        source={require("../../assets/otumba-banner.jpg")}
        style={styles.banner}
        resizeMode="cover"
      />

      <Text style={styles.subtitle}>
        Descubre negocios locales, servicios, comida y más cerca de ti 🍽️🛍️
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Categories")}
      >
        <Text style={styles.buttonText}>Ver categorías</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 20,
  },
  headerContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  promoCard: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    paddingBottom: 10,
    marginHorizontal: 10,
    width: Dimensions.get("window").width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  promoImage: {
    width: "100%",
    height: 140,
  },
  promoTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
  },
  promoDesc: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: '#333',
  },
  banner: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    color: "#555",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#339933",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "70%",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});