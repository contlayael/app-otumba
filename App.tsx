// App.tsx
import React, { useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font"; // <-- NECESITAS ESTO
import * as SplashScreen from "expo-splash-screen"; // <-- NECESITAS ESTO
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // <-- Asegúrate de importar los sets de iconos que uses

// Importa SafeAreaProvider
import { SafeAreaProvider } from "react-native-safe-area-context"; // <-- AÑADE ESTO

// Tu navegador principal
import AppNavigator from "./app/navigation/AppNavigator";

// Mantén la splash screen visible hasta que las fuentes estén cargadas y la app esté lista
SplashScreen.preventAutoHideAsync();

export default function App() {
  // Carga las fuentes. Incluye .font de cada set de iconos que uses.
  const [fontsLoaded, fontError] = useFonts({
    // Incluye aquí los sets de iconos que usas.
    // Revisa tu código para ver qué prefijos de iconos utilizas (e.g., <Ionicons ... />, <MaterialIcons ... />)
    ...Ionicons.font,
    ...MaterialIcons.font,
    // Puedes añadir tus fuentes personalizadas aquí si las tienes:
    // 'NombreDeTuFuente': require('./assets/fonts/TuFuente.ttf'),
    // ... otras fuentes que tengas en tu proyecto ...
  });

  // Este efecto se ejecuta cuando las fuentes se cargan o hay un error
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync(); // Oculta la splash screen
    }
  }, [fontsLoaded, fontError]);

  // Si las fuentes no se han cargado y no hay error, muestra null (o una pantalla de carga)
  // Esto evita que tu AppNavigator intente renderizar iconos antes de que sus fuentes estén disponibles.
  if (!fontsLoaded && !fontError) {
    return null; // Puedes poner una pantalla de carga aquí si lo deseas
  }

  // Una vez que las fuentes están cargadas, renderiza tu aplicación principal
  return (
    // Envuelve tu aplicación con SafeAreaProvider
    <SafeAreaProvider style={styles.container} onLayout={onLayoutRootView}>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

// Puedes definir tus estilos aquí o en un archivo separado
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Asegúrate de que tu contenedor o el AppNavigator tenga el estilo correcto
    // para ocupar toda la pantalla, si es necesario.
  },
});

// registerRootComponent(App); // Esto ya no es necesario si estás usando un setup estándar de Expo con App.tsx
