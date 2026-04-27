import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckboxComponent from '../profile/components/CheckBoxComponent';
import SelectorComponent from '../profile/components/SelectorComponent';
import styles from '../profile/styles/profile.style';

export default function Profile() {
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: "",
    nutritionGoal: "Perte de poids", 
    diet: "Omnivore", 
    budget: "Moyen",
    allergies: { Gluten: false, Lactose: false, Arachides: true, Crustacés: false },
    sportGoal: "Renforcement musculaire", 
    fitnessLevel: "Débutant", 
    equipment: { "Salle de sport": false, "Poids à domicile": true, "Aucun (Poids du corps)": false },
    limitations: "Douleur au genou droit",
    photoUri: null as string | null,
  });

  const [initials, setInitials] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem("userData");
        if (userString) {
          const user = JSON.parse(userString);
          const fullName = `${user.firstname} ${user.lastname}`;
          
          setProfile(prev => ({ ...prev, name: fullName }));
          
          const firstInitial = user.firstname ? user.firstname.charAt(0).toUpperCase() : "";
          const lastInitial = user.lastname ? user.lastname.charAt(0).toUpperCase() : "";
          setInitials(firstInitial + lastInitial);
        }
      } catch (error) {
        console.error("Erreur de récupération profil", error);
      }
    };
    fetchUserData();

    const loadData = async () => {
      try {
        // 1. Récupération locale pour le nom et l'avatar
        const userString = await AsyncStorage.getItem("userData");
        if (userString) {
          const user = JSON.parse(userString);
          const fullName = `${user.firstname} ${user.lastname}`;
          setProfile(prev => ({ ...prev, name: fullName }));
          
          const firstInitial = user.firstname ? user.firstname.charAt(0).toUpperCase() : "";
          const lastInitial = user.lastname ? user.lastname.charAt(0).toUpperCase() : "";
          setInitials(firstInitial + lastInitial);
        }

        // 2. NOUVEAU : Récupération du profil depuis MongoDB
        const token = await AsyncStorage.getItem("authToken");
        const API_URL = process.env.EXPO_PUBLIC_API_URL; // Ton IP locale

        if (token) {
          const response = await fetch(`${API_URL}/api/profil`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const dbProfile = await response.json();
            // On met à jour le state avec les vraies données de la BDD !
            setProfile(prev => ({ ...prev, ...dbProfile }));
          }
        }
      } catch (error) {
        console.error("Erreur de récupération profil", error);
      }
    };
    
    loadData();
  }, []);

  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const destructiveColor = useThemeColor({}, 'destructive');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) setProfile({ ...profile, photoUri: result.assets[0].uri });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userData");
    router.replace("/login");
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const API_URL = process.env.EXPO_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/api/profil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // On envoie tout notre objet "profile" au format JSON
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        Alert.alert(
          "Succès", 
          "Profil sauvegardé avec succès dans la base de données ! L'IA prendra en compte vos critères."
        );
      } else {
        Alert.alert("Erreur", "Impossible de sauvegarder le profil.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème de connexion au serveur Backend.");
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, backgroundColor, paddingBottom: 100 }}>
        <ThemedText type="title" style={{ marginBottom: 4 }}>Mon Profil IA</ThemedText>
        <Text style={{ color: mutedColor, marginBottom: 24, fontSize: 15 }}>
          Ces données permettent à l'Intelligence Artificielle de générer des recommandations sur-mesure.
        </Text>

        <View style={styles.headerProfile}>
          <TouchableOpacity onPress={pickImage} accessibilityLabel="Changer la photo de profil">
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: primaryColor }]}>
                <Text style={{ color: primaryForeground, fontSize: 32, fontWeight: "bold" }}>
                  {initials || "?"}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.label, { color: cardTextColor }]}>Nom complet</Text>
            <TextInput 
              value={profile.name} 
              onChangeText={t => setProfile({...profile, name: t})} 
              style={[styles.input, { borderColor, backgroundColor: cardColor, color: cardTextColor }]} 
              accessibilityLabel="Champ nom complet"
            />
          </View>
        </View>

        {/* SECTION NUTRITION */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.cardTitle, { color: primaryColor }]}>🥗 Paramètres Nutrition</Text>
          
          <SelectorComponent 
            label="Objectif de santé" 
            options={["Perte de poids", "Prise de masse", "Équilibre", "Performance"]} 
            selectedValue={profile.nutritionGoal} 
            onSelect={(v: string) => setProfile({...profile, nutritionGoal: v})} 
          />

          <SelectorComponent  
            label="Préférences alimentaires" 
            options={["Omnivore", "Végétarien", "Végétalien", "Poisson uniquement"]} 
            selectedValue={profile.diet} 
            onSelect={(v: string) => setProfile({...profile, diet: v})} 
          />

          <View style={styles.section}>
            <Text style={[styles.label, { color: cardTextColor }]}>Allergies & Intolérances</Text>
            <View style={styles.checkboxContainer}>
              {/* Utilisation du nouveau composant Checkbox */}
              {Object.entries(profile.allergies).map(([key, value]) => (
                <CheckboxComponent 
                  key={key}
                  label={key}
                  value={value}
                  onChange={() => setProfile({...profile, allergies: {...profile.allergies, [key]: !value}})}
                />
              ))}
            </View>
          </View>
        </View>

        {/* SECTION SPORT */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.cardTitle, { color: primaryColor }]}>💪 Paramètres Sportifs</Text>
          
          <SelectorComponent  
            label="Objectif d'entraînement" 
            options={["Perte de graisse", "Musculation", "Endurance", "Santé générale"]} 
            selectedValue={profile.sportGoal} 
            onSelect={(v: string) => setProfile({...profile, sportGoal: v})} 
          />

          <SelectorComponent  
            label="Niveau de forme actuel" 
            options={["Débutant", "Intermédiaire", "Avancé"]} 
            selectedValue={profile.fitnessLevel} 
            onSelect={(v: string) => setProfile({...profile, fitnessLevel: v})} 
          />

          <View style={styles.section}>
            <Text style={[styles.label, { color: cardTextColor }]}>Équipement disponible</Text>
            <View style={styles.checkboxContainer}>
              {/* Utilisation du nouveau composant Checkbox */}
              {Object.entries(profile.equipment).map(([key, value]) => (
                <CheckboxComponent 
                  key={key}
                  label={key}
                  value={value}
                  onChange={() => setProfile({...profile, equipment: {...profile.equipment, [key]: !value}})}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: cardTextColor }]}>Limitations physiques (Blessures)</Text>
            <TextInput 
              value={profile.limitations} 
              onChangeText={t => setProfile({...profile, limitations: t})} 
              style={[styles.input, { borderColor: borderColor, backgroundColor: cardColor, color: cardTextColor, height: 80 }]} 
              multiline
              placeholder="Ex: Douleur épaule, asthme..."
              placeholderTextColor={mutedColor}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: primaryColor }]} onPress={handleSave}>
            <Text style={{ color: primaryForeground, fontWeight: "bold", fontSize: 16 }}>Enregistrer pour l'IA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 1, borderColor: destructiveColor, marginTop: 12 }]} onPress={handleLogout}>
            <Text style={{ color: destructiveColor, fontWeight: "bold", fontSize: 16 }}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ThemedView>
  );
}
