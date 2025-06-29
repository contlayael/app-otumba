// app/screens/BusinessDashboardScreen.tsx (CORREGIDO)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image // Importa Image para mostrar la vista previa
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { signOut, User } from 'firebase/auth';
import { auth, db, storage } from '../../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// ▼▼▼ CAMBIO AQUÍ: Importaciones de Firebase Storage actualizadas ▼▼▼
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
// Se elimina 'FileSystem' ya que no es necesario
import * as ImageManipulator from 'expo-image-manipulator';


// Definición de las categorías que un negocio puede seleccionar
const BUSINESS_CATEGORIES = [
  { label: 'Selecciona una categoría', value: '' },
  { label: 'Restaurantes', value: 'restaurantes' },
  { label: 'Servicio', value: 'servicios' },
  { label: 'Abarrotes', value: 'abarrotes' },
  { label: 'Hotel', value: 'hoteles' },
  { label: 'Estética y Barber', value: 'estetica-barber' },
];

export default function BusinessDashboardScreen() {
  const navigation = useNavigation();

  // Estados para los campos del formulario
  const [businessName, setBusinessName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(''); // URL de la imagen cargada/existente
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Estados para la carga de datos y guardar
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [savingData, setSavingData] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  // Estados para la carga de imágenes
  const [pickingImage, setPickingImage] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Efecto para cargar la información del negocio cuando el componente se monta
  useEffect(() => {
    const fetchBusinessData = async () => {
      const user: User | null = auth.currentUser;
      if (!user) {
        console.warn("No hay usuario autenticado en BusinessDashboardScreen.");
        setLoadingData(false);
        return;
      }

      try {
        const businessDocRef = doc(db, 'businesses', user.uid);
        const businessDocSnap = await getDoc(businessDocRef);

        if (businessDocSnap.exists()) {
          const data = businessDocSnap.data();
          setBusinessName(data.name || '');
          setDescription(data.description || '');
          setAddress(data.address || '');
          setPhone(data.phone || '');
          setHours(data.hours || '');
          setImageUrl(data.image || ''); // Carga la URL de imagen existente
          setLatitude(data.latitude ? String(data.latitude) : '');
          setLongitude(data.longitude ? String(data.longitude) : '');
          setSelectedCategory(data.category || '');
        }
      } catch (error) {
        console.error("Error al cargar los datos del negocio:", error);
        Alert.alert("Error", "No se pudieron cargar los datos del negocio.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchBusinessData();
  }, []);

  // Función para seleccionar una imagen de la galería
  const pickImage = async () => {
    setPickingImage(true);

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitas otorgar permiso para acceder a tu galería.');
      setPickingImage(false);
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const originalUri = result.assets[0].uri;

      // Reducir resolución y calidad
      const manipResult = await ImageManipulator.manipulateAsync(
        originalUri,
        [{ resize: { width: 800 } }], // reduce ancho, mantiene aspect ratio
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImageUrl(manipResult.uri); // guarda la imagen reducida
    }

    setPickingImage(false);
  };

  // ▼▼▼ CAMBIO AQUÍ: Bloque de subida de imagen completamente reemplazado ▼▼▼
  /**
   * Convierte una URI de archivo local (ej. 'file://...') a un objeto Blob.
   * @param uri La URI local de la imagen.
   * @returns Una promesa que se resuelve con el objeto Blob.
   */
  async function uriToBlob(uri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error("uriToBlob falló:", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  }

  /**
   * Sube una imagen a Firebase Storage usando un Blob.
   * @param uri La URI local de la imagen seleccionada.
   * @param uid El ID del usuario para organizar el almacenamiento.
   * @returns La URL de descarga de la imagen subida o null si falla.
   */
  const uploadImage = async (uri: string, uid: string): Promise<string | null> => {
    setUploadingImage(true);
    try {
      const blob = await uriToBlob(uri);
      const fileName = `business_images/${uid}/${Date.now()}.jpg`;
      const imageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;

    } catch (error: any) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error al subir", `No se pudo subir la imagen. Por favor, inténtalo de nuevo.`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  // ▲▲▲ FIN DE CAMBIOS ▲▲▲

  // Función para guardar la información del negocio
  const handleSaveBusinessData = async () => {
    setSavingData(true);
    setMessage(null);

    const user: User | null = auth.currentUser;
    if (!user) {
      setMessage("Error: Usuario no autenticado.");
      setMessageType('error');
      setSavingData(false);
      return;
    }

    // Validación básica de campos
    if (!businessName || !description || !address || !phone || !hours || !selectedCategory) {
      setMessage("Por favor, completa todos los campos del negocio, incluyendo la categoría.");
      setMessageType('error');
      setSavingData(false);
      return;
    }

    if (!imageUrl) {
      setMessage("Por favor, selecciona una imagen para tu negocio.");
      setMessageType('error');
      setSavingData(false);
      return;
    }

    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      setMessage("La latitud y longitud deben ser números válidos.");
      setMessageType('error');
      setSavingData(false);
      return;
    }

    let finalImageUrl = imageUrl;

    if (!imageUrl.startsWith('http') && imageUrl.startsWith('file://')) {
      const uploadedURL = await uploadImage(imageUrl, user.uid);
      if (uploadedURL) {
        finalImageUrl = uploadedURL;
      } else {
        setSavingData(false);
        return;
      }
    }

    try {
      const businessDocRef = doc(db, 'businesses', user.uid);
      await setDoc(businessDocRef, {
        name: businessName,
        description: description,
        address: address,
        phone: phone,
        hours: hours,
        image: finalImageUrl,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        category: selectedCategory,
      }, { merge: true });

      setMessage("¡Información guardada exitosamente!");
      setMessageType('success');
    } catch (error) {
      console.error("Error al guardar la información del negocio:", error);
      setMessage("Error al guardar la información. Inténtalo de nuevo.");
      setMessageType('error');
    } finally {
      setSavingData(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando datos del negocio...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Panel de Administración de Negocio</Text>
      <Text style={styles.subtitle}>Actualiza la información de tu negocio</Text>

      {message && (
        <Text style={messageType === 'success' ? styles.successText : styles.errorText}>
          {message}
        </Text>
      )}

      <Text style={styles.label}>Nombre del Negocio</Text>
      <TextInput
        style={styles.input}
        value={businessName}
        onChangeText={setBusinessName}
        placeholder="Ej: Tacos El Güero"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.inputMultiline}
        value={description}
        onChangeText={setDescription}
        placeholder="Una breve descripción de tu negocio"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Ej: Calle Juárez #12, Otumba, Edo. Méx."
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Ej: 5512345678"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Horario</Text>
      <TextInput
        style={styles.input}
        value={hours}
        onChangeText={setHours}
        placeholder="Ej: Lun-Dom 9:00am - 11:00pm"
      />
      
      <Text style={styles.label}>Imagen del Negocio</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.previewImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>No hay imagen seleccionada</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.imagePickerButton}
        onPress={pickImage}
        disabled={pickingImage || uploadingImage}
      >
        {pickingImage ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {uploadingImage ? 'Subiendo Imagen...' : 'Seleccionar Imagen'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Latitud</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="Ej: 19.7005"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitud</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="Ej: -98.7542"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Categoría del Negocio</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {BUSINESS_CATEGORIES.map((cat) => (
            <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveBusinessData}
        disabled={savingData || uploadingImage || pickingImage}
      >
        {savingData ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar Información</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ... (tus estilos permanecen sin cambios)
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  inputMultiline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successText: {
    color: '#28a745',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  pickerItem: {
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
});