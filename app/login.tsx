import { useState } from "react";
import { Button, TextInput, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const labelColor = useThemeColor({}, 'mutedForeground');
  const borderColor = useThemeColor({}, 'border');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const buttonColor = useThemeColor({}, 'primary');
  const linkColor = useThemeColor({}, 'tint');
  const errorColor = useThemeColor({}, 'destructive');

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Impossible de se connecter.");
        return;
      }
      await AsyncStorage.setItem("authToken", data.token);
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error(err);
      setError("Impossible de joindre le service d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <ThemedText type="title" style={styles.title}>Connexion</ThemedText>
      <Text style={[styles.label, { color: labelColor }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
        placeholder="email@example.com"
        placeholderTextColor={labelColor}
      />
      <Text style={[styles.label, { color: labelColor }]}>Mot de passe</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
        placeholder="••••••••"
        placeholderTextColor={labelColor}
      />
      {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}
      <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleSubmit} disabled={loading} color={buttonColor} />
      <TouchableOpacity onPress={() => router.push("/register")} style={styles.linkContainer}>
        <Text style={[styles.link, { color: linkColor }]}>Pas encore de compte ? Inscris-toi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  error: {
    marginBottom: 12,
  },
  linkContainer: {
    marginTop: 16,
  },
  link: {
    textAlign: "center",
    fontWeight: "500",
  },
});
