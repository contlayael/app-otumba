import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessList'>;

const businessesByCategory: Record<string, { id: string; name: string }[]> = {
  '1': [
    { id: 'comida-1', name: 'Tacos El Güero' },
    { id: 'comida-2', name: 'Gorditas Doña Mary' },
  ],
  '2': [
    { id: 'servicio-1', name: 'Plomería Ramírez' },
    { id: 'servicio-2', name: 'Electricista Pedro' },
  ],
  '3': [
    { id: 'tienda-1', name: 'Miscelánea Lupita' },
    { id: 'tienda-2', name: 'Papelería La Pluma' },
  ],
  '4': [
    { id: 'turismo-1', name: 'Tour Teotihuacán' },
    { id: 'turismo-2', name: 'Cabalgatas Otumba' },
  ],
};

const iconMap: Record<string, string> = {
  '1': 'utensils',
  '2': 'tools',
  '3': 'store',
  '4': 'map-marked-alt',
};

export default function BusinessListScreen({ route, navigation }: Props) {
  const { categoryId, categoryName } = route.params;
  const businesses = businessesByCategory[categoryId] || [];
  const iconName = iconMap[categoryId] || 'store';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Negocios de {categoryName}</Text>

      <FlatList
        data={businesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
            onPress={() => navigation.navigate('BusinessDetails', { id: item.id })}
          >
            <FontAwesome5 name={iconName as any} size={24} color="#333" style={styles.icon} />
            <Text style={styles.cardText}>{item.name}</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefefe', padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.2,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
});
