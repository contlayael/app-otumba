// app/screens/RegisterScreen.tsx
import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState<'client' | 'business'>('client'); // <-- Estado para el rol
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    setMessage(null);
    setMessageType(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Por favor, completa todos los campos.");
      setMessageType('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType('error');
      return;
    }
    if (password.length < 6) {
        setMessage("La contraseña debe tener al menos 6 caracteres.");
        setMessageType('error');
        return;
    }

    setLoading(true);

    try {
      // 1. Crea el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // 2. Guarda la información adicional del usuario en Firestore según el rol
      const collectionName = userRole === 'client' ? 'clients' : 'businesses';
      await setDoc(doc(db, collectionName, uid), {
        fullName,
        email,
        role: userRole, // Guarda el rol explícitamente
        createdAt: new Date(),
        // isActive: false, // Esto podría ser solo para negocios si aplica
      });

      setMessage("¡Registro exitoso! Redirigiendo...");
      setMessageType('success');
      // Limpiar campos después de un registro exitoso
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUserRole('client'); // Resetear el rol a cliente por defecto

      // <-- MODIFICACIÓN CLAVE: Navegar a la pantalla Home después de un registro exitoso
      // Esto hará que el usuario vea la aplicación principal y sienta que inició sesión
      navigation.navigate('Home'); // Puedes cambiar 'Home' por otra ruta si lo necesitas

    } catch (error: any) {
      console.error("Error de registro:", error);
      console.error("Código de error:", error.code);
      console.error("Mensaje de error:", error.message);

      let errorMessageText = "Error al registrar. Inténtalo de nuevo.";
      if (error.code === "auth/email-already-in-use") {
        errorMessageText = "El correo electrónico ya está en uso.";
      } else if (error.code === "auth/invalid-email") {
        errorMessageText = "El formato del correo electrónico es inválido.";
      } else if (error.code === "auth/weak-password") {
        errorMessageText = "La contraseña es demasiado débil. Usa al menos 6 caracteres.";
      } else {
        errorMessageText = `Error: ${error.code || 'desconocido'}. Inténtalo de nuevo.`;
      }
      setMessage(errorMessageText);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>
      <Text style={styles.subtitle}>Regístrate para empezar</Text>

      {message && (
        <Text style={messageType === 'success' ? styles.successText : styles.errorText}>
          {message}
        </Text>
      )}

      <TextInput
        placeholder="Nombre Completo"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        autoCapitalize="words"
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#999"
      />

      <View style={styles.roleSelectorContainer}>
        <Text style={styles.roleSelectorLabel}>Soy:</Text>
        <TouchableOpacity
          style={[styles.roleButton, userRole === 'client' && styles.roleButtonActive]}
          onPress={() => setUserRole('client')}
        >
          <Text style={[styles.roleButtonText, userRole === 'client' && styles.roleButtonTextActive]}>Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, userRole === 'business' && styles.roleButtonActive]}
          onPress={() => setUserRole('business')}
        >
          <Text style={[styles.roleButtonText, userRole === 'business' && styles.roleButtonTextActive]}>Negocio</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    width: "90%",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "90%",
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007bff",
    fontSize: 14,
    marginTop: 10,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "#dc3545",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
  successText: {
    color: "#28a745",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 14,
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
    justifyContent: 'center',
  },
  roleSelectorLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: 'bold',
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#fff',
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: '#007bff',
  },
  roleButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
});
