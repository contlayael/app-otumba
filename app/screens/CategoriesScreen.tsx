import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'>;

const categories = [
  { id: '1', name: 'Comida' },
  { id: '2', name: 'Servicios' },
  { id: '3', name: 'Tiendas' },
  { id: '4', name: 'Turismo' },
];

export default function CategoriesScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BusinessList', {
                categoryId: item.id,
                categoryName: item.name,
              })}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
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
});
