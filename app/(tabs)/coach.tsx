// TODO: Follow the react conventions.
// In React, files shouldn't be larger than 150 lines.
// There are 235 lines in this file. We need to optimize
// it or the page will be heavy and become hard to
// maintain.

import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MockData } from '../mockdata';

interface NutritionAnalysis {
  dishName: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  confidence: number;
}

type CoachMode = "nutrition" | "sport";

export default function Coach() {
  const params = useLocalSearchParams();
  const [mode, setMode] = useState<CoachMode>("nutrition");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionAnalysis | null>(null);
  const [firstName, setFirstName] = useState(""); 
  const [isConfirmed, setIsConfirmed] = useState(false); 
  const [loading, setLoading] = useState(false);

  // Récupération du prénom
  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("userData");
      if (userString) {
        const user = JSON.parse(userString);
        setFirstName(user.firstname);
      }
    };
    fetchUser();
    if (params.mode === "nutrition" || params.mode === "sport") {
      setMode(params.mode as CoachMode);
    }
  }, [params.mode]);

  const nutritionAlert = "L'IA a détecté un déficit en protéines hier.";

  // TODO: Move these mock value elsewhere.
  const mealSuggestions = [
    { id: 1, name: "Salade de poulet grillé", calories: 450, proteins: 35, price: "~6€", time: "20 min" },
    { id: 2, name: "Bol de quinoa aux légumes", calories: 380, proteins: 15, price: "~4€", time: "25 min" },
    { id: 3, name: "Omelette aux épinards", calories: 320, proteins: 28, price: "~3€", time: "15 min" },
  ];

  const workoutPlan = [
    { id: 1, name: "Pompes", sets: "3 x 12", rest: "60s", target: "Pectoraux, triceps" },
    { id: 2, name: "Squats", sets: "4 x 15", rest: "60s", target: "Jambes, fessiers" },
    { id: 3, name: "Planche", sets: "3 x 45s", rest: "45s", target: "Core, abdominaux" },
    { id: 4, name: "Burpees", sets: "3 x 10", rest: "90s", target: "Corps entier" },
  ];

  // FIXME: Remove unused value
  // TODO: Move these into a theme config file.
  // This is to follow the React conventions.
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  // TODO: Move this function in a media control file
  // This is to follow the React conventions.
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Désolé, nous avons besoin de la permission pour accéder à vos photos !");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // FIXME: Deprecated.
      // This is deprecated. We need to use ImagePicker.MediaType
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // TODO: Move this function in a media control file
  // This is to follow the React conventions.
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Désolé, nous avons besoin de la permission pour accéder à la caméra !");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setIsConfirmed(false);
    setAnalysisResult(null);

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    try {
      const formData = new FormData();
      formData.append("image", {
        uri:  selectedImage,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const aiResponse = await fetch(`${API_URL}/api/ai/predict`, {
        method:  "POST",
        body:    formData,
        headers: { "Accept": "application/json" },
      });

      const aiData = await aiResponse.json();

      if (!aiResponse.ok) {
        Alert.alert("Erreur", aiData.message || `Erreur ${aiResponse.status}`);
        return;
      }

      if (aiData.prediction) {
        // ✅ Fix 1 : afficher le résultat immédiatement
        setAnalysisResult({
          dishName:   aiData.prediction,
          confidence: aiData.confidence_percent ?? 0,
          calories:   0,
          proteins:   0,
          carbs:      0,
          fats:       0,
        });

        const token = await AsyncStorage.getItem("authToken");
        const saveResponse = await fetch(`${API_URL}/api/calories/add-from-ai`, {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ prediction: aiData.prediction }),
        });

        if (saveResponse.ok) {
          const result = await saveResponse.json();
          // ✅ Fix 2 : mettre à jour avec les vraies valeurs nutritionnelles
          setAnalysisResult(prev => ({
            ...prev!,
            calories: result.added?.calories ?? 0,
            proteins: result.added?.proteins ?? 0,
            carbs:    result.added?.carbs    ?? 0,
            fats:     result.added?.fats     ?? 0,
          }));
          Alert.alert(
            "✅ Analyse réussie",
            `Plat : ${aiData.prediction}\n+${result.added?.calories ?? "?"} kcal ajoutées !`
          );
        } else {
          Alert.alert("⚠️ Détecté", `Plat : ${aiData.prediction}\nImpossible de sauvegarder les calories.`);
        }
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de joindre le serveur.");
    } finally {
      setLoading(false); // ✅ Fix 3
    }
  };


  const handleConfirmIA = () => {
    setIsConfirmed(true);
    Alert.alert("Merci !", "Votre confirmation aide l'IA à apprendre.");
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsConfirmed(false);
  };

  return (
    <ScrollView 
      contentContainerStyle={[{ padding: 16, paddingBottom: 100, backgroundColor }]}
      accessible={true}
    > 
      <Text 
        style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4, color: cardTextColor }}
        accessibilityRole="header"
      >
        Mon Coach IA
      </Text>
      
      <Text style={{ fontSize: 16, color: mutedColor, marginBottom: 16 }}>
        Ravi de vous voir, {firstName || "Bob"} !
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <Pressable
          onPress={() => setMode("nutrition")}
          accessibilityRole="tab"
          accessibilityLabel="Mode Nutrition"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            backgroundColor: mode === "nutrition" ? "#10B981" : "#F3F4F6",
            marginRight: 4,
          }}
        >
          <Text style={{ textAlign: "center", color: mode === "nutrition" ? "white" : "#2C3E50", fontWeight: "bold" }}>Nutrition</Text>
        </Pressable>

        <Pressable
          onPress={() => setMode("sport")}
          accessibilityRole="tab"
          accessibilityLabel="Mode Sport"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 12,
            backgroundColor: mode === "sport" ? "#10B981" : "#F3F4F6",
            marginLeft: 4,
          }}
        >
          <Text style={{ textAlign: "center", color: mode === "sport" ? "white" : "#2C3E50", fontWeight: "bold" }}>Sport</Text>
        </Pressable>
      </View>

      {mode === "nutrition" && (
        <View style={{ marginBottom: 24 }}>
          {/* Analyse Image */}
          <View style={{ marginBottom: 16 }}>
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage }} 
                style={{ width: "100%", height: 220, marginBottom: 12, borderRadius: 12 }} 
                accessibilityLabel="Photo du plat à analyser"
              />
            )}
            <View style={{ gap: 8 }}>
                <Button title="Choisir une image" onPress={pickImage} accessibilityLabel="Ouvrir la galerie photo" />
                <Button title="Prendre une photo" onPress={takePhoto} accessibilityLabel="Ouvrir l'appareil photo" />
            </View>
            
            {selectedImage && (
              <View style={{ marginTop: 8, gap: 8 }}>
                <Button title="Analyser le plat" onPress={handleAnalyze} color={primaryColor} accessibilityLabel="Lancer l'analyse IA" />
                <Button title="Réinitialiser" onPress={handleReset} color="#EF4444" accessibilityLabel="Supprimer la photo" />
              </View>
            )}
          </View>

                                                                                                                              {/* Résultats avec bouton de confirmation IA */}
          {analysisResult && (
            <View 
              style={{ backgroundColor: cardColor, padding: 16, borderRadius: 12, marginBottom: 16, borderColor, borderWidth: 1 }}
              accessible={true}
              accessibilityLabel={`Résultat : ${analysisResult.dishName}`}
            >
              <Text style={{ fontWeight: "bold", fontSize: 18, color: cardTextColor }}>{analysisResult.dishName}</Text>
              <Text style={{ color: mutedColor }}>Précision IA : {analysisResult.confidence}%</Text>
              <View style={{ marginVertical: 8, borderTopWidth: 1, borderTopColor: borderColor, paddingTop: 8 }}>
                <Text style={{ color: cardTextColor }}>Calories : {analysisResult.calories}</Text>
                <Text style={{ color: cardTextColor }}>Protéines : {analysisResult.proteins}g | Glucides : {analysisResult.carbs}g</Text>
              </View>

              <TouchableOpacity 
                onPress={handleConfirmIA}
                disabled={isConfirmed}
                style={{
                    marginTop: 10,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: isConfirmed ? "#D1FAE5" : "#10B981",
                    alignItems: "center"
                }}
                accessibilityRole="button"
                accessibilityLabel="Confirmer l'exactitude de l'IA"                                          
              >
                <Text style={{ color: isConfirmed ? "#065F46" : "white", fontWeight: "bold" }}>
                   {isConfirmed ? "✓ Analyse confirmée" : "Est-ce le bon plat ? Confirmer"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View 
            style={{ backgroundColor: cardColor, padding: 12, borderLeftWidth: 4, borderLeftColor: primaryColor, borderRadius: 8, marginBottom: 16, borderColor, borderWidth: 1 }}
            accessible={true}
          >
            <Text style={{ fontWeight: "bold", color: cardTextColor, marginBottom: 4 }}>Conseil IA</Text>
            <Text style={{ color: mutedColor }}>{nutritionAlert}</Text>
          </View>

          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: textColor }}>Suggestions de repas</Text>
          {mealSuggestions.map((meal) => (
            <View key={meal.id} style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 8, borderColor, borderWidth: 1 }}>
              <Text style={{ fontWeight: "bold", color: cardTextColor }}>{meal.name}</Text>
              <Text style={{ color: mutedColor }}>{meal.calories} kcal • {meal.proteins}g Protéines</Text>
              <Text style={{ color: mutedColor }}>Prix: {meal.price} • Temps: {meal.time}</Text>
              <View style={{ marginTop: 8 }}>
                <Button title="Voir la recette" onPress={() => Alert.alert("Recette", "Fonctionnalité à venir")} />
              </View>
            </View>
          ))}
        </View>
      )}

      {mode === "sport" && (
        <View style={{ marginBottom: 24 }}>
          <Text 
            style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: textColor }}
            accessibilityRole="header"
          >
            Programme du jour
          </Text>
          {workoutPlan.map((exercise, idx) => (
            <View 
                key={exercise.id} 
                style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 8, borderColor, borderWidth: 1 }}
                accessible={true}
                accessibilityLabel={`Exercice ${idx + 1}: ${exercise.name}. ${exercise.sets}.`}
            >
              <Text style={{ fontWeight: "bold", color: cardTextColor }}>{idx + 1}. {exercise.name}</Text>
              <Text style={{ color: mutedColor }}>Séries: {exercise.sets} • Repos: {exercise.rest}</Text>
              <Text style={{ color: mutedColor }}>Cible: {exercise.target}</Text>
            </View>
          ))}
          <TouchableOpacity 
            onPress={() => Alert.alert("Fonctionnalité à venir")}
            style={{ backgroundColor: primaryColor, padding: 16, borderRadius: 12, marginTop: 10 }}
            accessibilityRole="button"
          >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Ajuster ma séance</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}