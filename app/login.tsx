import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const labelColor = useThemeColor({}, 'mutedForeground');
  const borderColor = useThemeColor({}, 'border');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const errorColor = useThemeColor({}, 'destructive');

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email ou mot de passe incorrect.");
        return;
      }

      await AsyncStorage.setItem("authToken", data.token);
      await AsyncStorage.setItem("userData", JSON.stringify(data.user));
      router.replace("/(tabs)/home");
    } catch (err) {
      setError("Serveur introuvable. Vérifiez l'IP et le port dans le .env.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ThemedText type="title" style={styles.title}>Bon retour !</ThemedText>
          <Text style={[styles.subtitle, { color: labelColor }]}>Connectez-vous pour accéder à votre coach IA.</Text>

          <View style={styles.form}>
            <Text style={[styles.label, { color: labelColor }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
              placeholder="votre@email.com"
              placeholderTextColor={labelColor}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Champ email"
            />

            <Text style={[styles.label, { color: labelColor }]}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
              placeholder="••••••••"
              placeholderTextColor={labelColor}
              accessibilityLabel="Champ mot de passe"
            />

            {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: primaryColor, opacity: loading ? 0.7 : 1 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color={primaryForeground} /> : <Text style={[styles.buttonText, { color: primaryForeground }]}>Se connecter</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/register")} style={styles.linkContainer}>
              <Text style={{ color: primaryColor, fontWeight: "500" }}>Pas encore de compte ? S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.devButton} 
              onPress={() => router.replace("/(tabs)/home")}
            >
              <Text style={styles.devButtonText}>🛠️ PASSER LA CONNEXION (MODE DEV) 🛠️</Text>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: "center" },
  form: { width: "100%" },
  label: { marginBottom: 8, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 16 },
  error: { marginBottom: 16, textAlign: "center" },
  button: { borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: "bold" },
  linkContainer: { marginTop: 24, alignItems: "center" },
  devButton: { marginTop: 50, backgroundColor: "fuchsia", padding: 15, borderWidth: 3, borderColor: "lime", borderStyle: "dashed", borderRadius: 8 },
  devButtonText: { color: "black", fontWeight: "900", textAlign: "center" }
});