import React, { useState } from "react";
import { View, Text, Button, Image, ScrollView, Pressable, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeColor } from '@/hooks/use-theme-color';

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
  const [mode, setMode] = useState<CoachMode>("nutrition");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionAnalysis | null>(null);

  const nutritionAlert = "L'IA a détecté un déficit en protéines hier.";

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

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  const primaryColor = useThemeColor({}, 'primary');
  const destructiveColor = useThemeColor({}, 'destructive');
  const borderColor = useThemeColor({}, 'border');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Désolé, nous avons besoin de la permission pour accéder à vos photos !");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", {
        uri: selectedImage,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json();
      if (data.status === "success") {
        setAnalysisResult({
          dishName: data.prediction,
          confidence: data.confidence_percent,
          calories: 0,
          proteins: 0,
          carbs: 0,
          fats: 0,
        });
      } else {
        Alert.alert("Erreur IA", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de joindre l'API Python.");
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <ScrollView contentContainerStyle={[{ padding: 16, backgroundColor }]}> 
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12, color: cardTextColor }}>Mon Coach IA</Text>

      {/* Toggle Nutrition / Sport */}
      <View style={{ flexDirection: "row", marginBottom: 16 }}>
        <Pressable
          onPress={() => setMode("nutrition")}
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

      {/* Mode Nutrition */}
      {mode === "nutrition" && (
        <View style={{ marginBottom: 24 }}>
          {/* Analyse Image */}
          <View style={{ marginBottom: 16 }}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={{ width: "100%", height: 200, marginBottom: 12, borderRadius: 12 }} />
            )}
            <Button title="Choisir une image" onPress={pickImage} />
            <View style={{ height: 8 }} />
            <Button title="Prendre une photo" onPress={takePhoto} />
            {selectedImage && (
              <>
                <View style={{ height: 8 }} />
                <Button title="Analyser le plat" onPress={handleAnalyze} />
                <View style={{ height: 8 }} />
                <Button title="Réinitialiser" onPress={handleReset} color="#EF4444" />
              </>
            )}
          </View>

          {/* Résultats */}
          {analysisResult && (
            <View style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 16, borderColor, borderWidth: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: cardTextColor }}>{analysisResult.dishName}</Text>
              <Text style={{ color: mutedColor }}>Précision IA : {analysisResult.confidence}%</Text>
              <Text style={{ color: mutedColor }}>Calories : {analysisResult.calories}</Text>
              <Text style={{ color: mutedColor }}>Protéines : {analysisResult.proteins}g</Text>
              <Text style={{ color: mutedColor }}>Glucides : {analysisResult.carbs}g</Text>
              <Text style={{ color: mutedColor }}>Lipides : {analysisResult.fats}g</Text>
            </View>
          )}

          {/* Alerte IA */}
          <View style={{ backgroundColor: cardColor, padding: 12, borderLeftWidth: 4, borderLeftColor: primaryColor, borderRadius: 8, marginBottom: 16, borderColor, borderWidth: 1 }}>
            <Text style={{ fontWeight: "bold", color: cardTextColor, marginBottom: 4 }}>Conseil IA</Text>
            <Text style={{ color: mutedColor }}>{nutritionAlert}</Text>
          </View>

          {/* Suggestions repas */}
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Suggestions de repas</Text>
          {mealSuggestions.map((meal) => (
            <View key={meal.id} style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 8, borderColor, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 }}>
              <Text style={{ fontWeight: "bold" }}>{meal.name}</Text>
              <Text>Calories: {meal.calories}</Text>
              <Text>Protéines: {meal.proteins}g</Text>
              <Text>Prix: {meal.price}</Text>
              <Text>Temps: {meal.time}</Text>
              <View style={{ marginTop: 8 }}>
                <Button title="Voir la recette" onPress={() => Alert.alert("Recette", "Fonctionnalité à venir")} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Mode Sport */}
      {mode === "sport" && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Programme du jour</Text>
          {workoutPlan.map((exercise, idx) => (
            <View key={exercise.id} style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 8, borderColor, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 }}>
              <Text style={{ fontWeight: "bold" }}>{idx + 1}. {exercise.name}</Text>
              <Text>Séries: {exercise.sets}</Text>
              <Text>Repos: {exercise.rest}</Text>
              <Text>Muscles ciblés: {exercise.target}</Text>
            </View>
          ))}
          <Button title="Ajuster ma séance" onPress={() => Alert.alert("Fonctionnalité à venir")} />
        </View>
      )}
    </ScrollView>
  );
}
