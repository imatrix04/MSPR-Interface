import { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";

import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Impossible de créer le compte.");
        return;
      }

      Alert.alert("Compte créé", "Votre compte a été créé avec succès !");
      router.replace("/login");
    } catch (err) {
      console.error(err);
      setError("Impossible de joindre le service d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <ThemedText type="title" style={[styles.title, { color: textColor }]}>Inscription</ThemedText>
      <Text style={[styles.subtitle, { color: labelColor }]}>Crée ton compte pour sauvegarder tes données et ton programme.</Text>

      <Text style={[styles.label, { color: labelColor }]}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      <Text style={[styles.label, { color: labelColor }]}>Confirmer le mot de passe</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
        placeholder="••••••••"
        placeholderTextColor={labelColor}
      />

      {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}

      <Button title={loading ? "Création..." : "Créer mon compte"} onPress={handleSubmit} disabled={loading} color={buttonColor} />

      <TouchableOpacity onPress={() => router.push("/login")} style={styles.linkContainer}>
        <Text style={[styles.link, { color: linkColor }]}>Déjà un compte ? Connecte-toi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  error: {
    marginBottom: 12,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  link: {
    fontWeight: "500",
  },
});
