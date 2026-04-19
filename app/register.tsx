import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const labelColor = useThemeColor({}, 'mutedForeground');
  const borderColor = useThemeColor({}, 'border');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const errorColor = useThemeColor({}, 'destructive');

  const handleSubmit = async () => {
    setError(null);
    
    if (!firstName || !lastName || !email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstname: firstName, 
          lastname: lastName, 
          email: email, 
          password: password 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Erreur lors de l'inscription.");
        return;
      }

      Alert.alert("Succès", "Compte créé ! Connectez-vous maintenant.");
      router.replace("/login");
    } catch (err) {
      setError("Impossible de joindre le serveur. Vérifiez l'IP et le port dans le .env.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedText type="title" style={styles.title}>Créer un compte</ThemedText>
            <Text style={[styles.subtitle, { color: labelColor }]}>
              Rejoins HealthAI Coach pour un suivi personnalisé.
            </Text>

            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={[styles.label, { color: labelColor }]}>Prénom</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
                    placeholder="Marie"
                    placeholderTextColor={labelColor}
                    accessibilityLabel="Champ prénom"
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={[styles.label, { color: labelColor }]}>Nom</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
                    placeholder="Dupont"
                    placeholderTextColor={labelColor}
                    accessibilityLabel="Champ nom"
                  />
                </View>
              </View>

              <Text style={[styles.label, { color: labelColor }]}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
                placeholder="nom@exemple.com"
                placeholderTextColor={labelColor}
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

              <Text style={[styles.label, { color: labelColor }]}>Confirmer le mot de passe</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={[styles.input, { borderColor, backgroundColor: inputBackground, color: textColor }]}
                placeholder="••••••••"
                placeholderTextColor={labelColor}
                accessibilityLabel="Confirmer le mot de passe"
              />

              {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}

              <TouchableOpacity 
                style={[styles.button, { backgroundColor: primaryColor, opacity: loading ? 0.7 : 1 }]} 
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color={primaryForeground} /> : <Text style={[styles.buttonText, { color: primaryForeground }]}>S'inscrire</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/login")} style={styles.linkContainer}>
                <Text style={{ color: primaryColor }}>Déjà membre ? Se connecter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, justifyContent: "center", flexGrow: 1 },
  title: { marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: "center" },
  form: { width: "100%" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  label: { marginBottom: 8, fontWeight: "600" },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 16 },
  error: { marginBottom: 16, textAlign: "center", fontWeight: "500" },
  button: { borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: "bold" },
  linkContainer: { marginTop: 24, alignItems: "center" }
});