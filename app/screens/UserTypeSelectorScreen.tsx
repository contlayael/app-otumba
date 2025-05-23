// app/screens/UserTypeSelectorScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function UserTypeSelectorScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo deseas usar la app?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VisitorStack')} // Navega al *nombre de la Screen* dentro de MainStack
      >
        <Text style={styles.buttonText}>Soy visitante</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AuthStack')} // Navega al *nombre de la Screen* dentro de MainStack
      >
        <Text style={styles.buttonText}>Soy un negocio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  button: {
    backgroundColor: '#339933',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});