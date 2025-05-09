import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/StackNavigator";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Descubre lo mejor de Otumba en un solo lugar
      </Text>

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
        source={require("../../assets/otumba-banner.jpg")} // asegúrate de tener esta imagen en /assets
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
    </View>
  );
}

const styles = StyleSheet.create({
  //Carousel
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  promoCard: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    paddingBottom: 10,
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

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    color: "#555",
  },
  button: {
    backgroundColor: "#339933",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const promotions = [
  {
    id: "comida-1",
    title: "Tacos “El Güero”",
    image: require("../../assets/promo1.jpg"),
    description: "2x1 en tacos los martes 🌮",
  },
  {
    id: "comida-2",
    title: "Papelería Lupita",
    image: require("../../assets/promo2.jpg"),
    description: "10% de descuento en útiles escolares ✏️",
  },
  {
    id: "comida-1",
    title: "Estética Rosy",
    image: require("../../assets/promo3.jpg"),
    description: "Corte y peinado por $100 💇‍♀️",
  },
];
