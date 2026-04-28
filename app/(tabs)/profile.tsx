import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProfileNutritionComponent from '../profile/components/ProfileNutritionComponent';
import ProfileSportComponent from '../profile/components/ProfileSportComponent';
import { useSaveProfile } from '../profile/hooks/useSaveProfile';
import putSaveProfileResponse from '../profile/models/putSaveProfile.model';
import styles from '../profile/styles/profile.style';

export default function Profile() {
  const router = useRouter();
  
  const [profile, setProfile] = useState<putSaveProfileResponse>({
    name: "",
    nutritionGoal: "Perte de poids", 
    diet: "Omnivore", 
    budget: "Moyen",
    allergies: { Gluten: false, Lactose: false, Arachides: true, Crustaces: false },
    sportGoal: "Renforcement musculaire", 
    fitnessLevel: "Débutant", 
    equipment: { "Salle de sport": false, "Poids à domicile": true, "Aucun (Poids du corps)": false },
    limitations: "Douleur au genou droit",
    photoUri: undefined,
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
        <ProfileNutritionComponent
          profile={profile}
          setProfile={setProfile}
        />

        {/* SECTION SPORT */}
        <ProfileSportComponent
          profile={profile}
          setProfile={setProfile}
        />

        <View style={{ marginTop: 16 }}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: primaryColor }]} onPress={() => {useSaveProfile(profile)}}>
            <Text style={{ color: primaryForeground, fontWeight: "bold", fontSize: 16 }}>Enregistrer pour l'IA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "transparent", borderWidth: 1, borderColor: destructiveColor, marginTop: 12 }]} onPress={() => {handleLogout()}}>
            <Text style={{ color: destructiveColor, fontWeight: "bold", fontSize: 16 }}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ThemedView>
  );
}
