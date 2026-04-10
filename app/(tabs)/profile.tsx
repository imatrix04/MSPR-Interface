import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Button, Pressable, Image, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useThemeColor } from '@/hooks/use-theme-color';

type Allergies = {
  gluten: boolean;
  lactose: boolean;
  nuts: boolean;
  shellfish: boolean;
  eggs: boolean;
};

type Equipment = {
  gym: boolean;
  dumbbells: boolean;
  none: boolean;
};

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Marie Dupont",
    goal: "weight-loss",
    budget: "medium",
    allergies: {
      gluten: false,
      lactose: false,
      nuts: true,
      shellfish: false,
      eggs: false,
    } as Allergies,
    equipment: {
      gym: false,
      dumbbells: true,
      none: false,
    } as Equipment,
    photoUri: null as string | null,
  });

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  const cardColor = useThemeColor({}, 'card');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const destructiveColor = useThemeColor({}, 'destructive');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setProfile({ ...profile, photoUri: result.assets[0].uri });
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setProfile({ ...profile, photoUri: result.assets[0].uri });
  };

  const handleSave = () => {
    Alert.alert("Profil sauvegardé", JSON.stringify(profile, null, 2));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12, color: cardTextColor }}>Mon Profil</Text>
      <Text style={{ color: mutedColor, marginBottom: 16 }}>Personnalisez vos préférences et objectifs</Text>

      {/* Photo de profil */}
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        {profile.photoUri ? (
          <Image source={{ uri: profile.photoUri }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 8 }} />
        ) : (
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: primaryColor, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <Text style={{ color: "white", fontSize: 32, fontWeight: "bold" }}>
              {profile.name.split(" ").map(n => n[0]).join("")}
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Button title="Changer photo" onPress={pickImage} />
          <Button title="Prendre photo" onPress={takePhoto} />
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 8 }}>{profile.name}</Text>
      </View>

      {/* Nom complet */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Nom complet</Text>
        <TextInput
          value={profile.name}
          onChangeText={text => setProfile({ ...profile, name: text })}
          style={{ borderWidth: 1, borderColor, borderRadius: 8, padding: 8, backgroundColor: cardColor, color: cardTextColor }}
        />
      </View>

      {/* Objectifs */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Objectif principal</Text>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor,
            borderRadius: 8,
            padding: 8,
            backgroundColor: cardColor,
          }}
          onPress={() => Alert.alert("Sélection objectif", "Fonctionnalité à implémenter")}
        >
          <Text>{profile.goal}</Text>
        </Pressable>
      </View>

      {/* Budget */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Budget par repas</Text>
        <Pressable
          style={{
            borderWidth: 1,
            borderColor,
            borderRadius: 8,
            padding: 8,
            backgroundColor: cardColor,
          }}
          onPress={() => Alert.alert("Sélection budget", "Fonctionnalité à implémenter")}
        >
          <Text>{profile.budget}</Text>
        </Pressable>
      </View>

      {/* Allergies */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Mes contraintes alimentaires</Text>
        {Object.entries(profile.allergies).map(([key, value]) => (
          <Pressable
            key={key}
            onPress={() =>
              setProfile({
                ...profile,
                allergies: { ...profile.allergies, [key]: !value },
              })
            }
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 4, borderWidth: 1,
              borderColor,
              backgroundColor: value ? primaryColor : cardColor,
              marginRight: 8
            }} />
            <Text style={{ color: cardTextColor }}>{key}</Text>
          </Pressable>
        ))}
      </View>

      {/* Équipement */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ marginBottom: 4, fontWeight: "bold" }}>Équipement sportif disponible</Text>
        {Object.entries(profile.equipment).map(([key, value]) => (
          <Pressable
            key={key}
            onPress={() =>
              setProfile({
                ...profile,
                equipment: { ...profile.equipment, [key]: !value },
              })
            }
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 4, borderWidth: 1,
              borderColor,
              backgroundColor: value ? primaryColor : cardColor,
              marginRight: 8
            }} />
            <Text style={{ color: cardTextColor }}>{key}</Text>
          </Pressable>
        ))}
      </View>

      {/* Boutons */}
      <View style={{ marginBottom: 32 }}>
        <Button title="Enregistrer les modifications" onPress={handleSave} color={primaryColor} />
        <View style={{ height: 8 }} />
        <Button title="Se déconnecter" onPress={handleLogout} color={destructiveColor} />
      </View>
    </ScrollView>
  );
}
