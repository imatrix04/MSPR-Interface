import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Bell, Camera } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export default function Home() {
  const router = useRouter(); 
  const [firstName, setFirstName] = useState("");
  
  const [macros, setMacros] = useState({
    calories: { objective: 2000, now: 0 },
    proteine: { objective: 150, now: 0 },
    carbs: { objective: 250, now: 0 },
    fat: { objective: 70, now: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = await AsyncStorage.getItem("userData");
        if (userString) {
          const user = JSON.parse(userString);
          setFirstName(user.firstname); 
        }

        const token = await AsyncStorage.getItem("authToken");
        const API_URL = process.env.EXPO_PUBLIC_API_URL;

        if (token) {
          const response = await fetch(`${API_URL}/api/calories/resume`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const data = await response.json();
            setMacros(data); 
          }
        }
      } catch (error) {
        console.error("Erreur de récupération", error);
      }
    };
    
    fetchData();
  }, []);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  const cardColor = useThemeColor({}, 'card');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const destructiveColor = useThemeColor({}, 'destructive');

  // --- LOGIQUE D'AFFICHAGE ---
  const caloriesConsumed = macros.calories.now;
  const caloriesGoal = macros.calories.objective;
  const caloriesProgress = caloriesGoal > 0 ? (caloriesConsumed / caloriesGoal) * 100 : 0;
  
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(caloriesProgress, 100) / 100);

  const macronutrientsList = [
    { name: "Protéines", consumed: macros.proteine.now, goal: macros.proteine.objective, unit: "g", color: "#F59E0B" },
    { name: "Glucides", consumed: macros.carbs.now, goal: macros.carbs.objective, unit: "g", color: "#3B82F6" },
    { name: "Lipides", consumed: macros.fat.now, goal: macros.fat.objective, unit: "g", color: "#EF4444" }
  ];

                  // Fausse donnée pour le sport (en attendant l'API Sport)
  const nextActivity = {
    name: "Séance Haut du corps",
    duration: "45 min",
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor, paddingBottom: 100 }]}
      accessible={true} 
    > 
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text 
              style={[styles.title, { color: textColor }]}
              accessibilityRole="header"
            > 
              Bonjour <Text style={styles.bold}>{firstName || "Bob"} 👋</Text> !{"\n"}
              Prêt(e) pour tes objectifs ?
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}> 
              Tes données sont à jour.
            </Text>
          </View>
          <Pressable 
            style={styles.notificationBtn}
            accessibilityRole="button"
            accessibilityLabel="Voir les notifications"
          >
            <Bell size={24} color={textColor} />
            <View style={[styles.notificationDot, { backgroundColor: destructiveColor }]} />
          </Pressable>
        </View>
      </View>

      {/* BOUTON D'ANALYSE IA */}
      <Pressable 
        style={[styles.mainActionBtn, { backgroundColor: primaryColor }]}
        accessibilityRole="button"
        accessibilityLabel="Analyser un repas avec la caméra"
        accessibilityHint="Ouvre l'appareil photo pour calculer les calories de votre plat"
        onPress={() => router.push("/coach?mode=nutrition")}
      >
        <Camera size={32} color={primaryForeground} />
        <Text style={[styles.mainActionText, { color: primaryForeground }]}>Analyser mon repas</Text>
      </Pressable>

      {/* CARTE CALORIES */}
      <View 
        style={[styles.card, { backgroundColor: cardColor, borderColor }]}
        accessible={true}
        accessibilityLabel={`Calories consommées : ${caloriesConsumed} sur ${caloriesGoal} kcal.`}
      >
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Calories du jour</Text>
        <View style={styles.circleContainer}>
          <Svg width={192} height={192} viewBox="0 0 192 192">
            <Circle cx="96" cy="96" r={radius} stroke={borderColor} strokeWidth="16" fill="none" />
            <Circle cx="96" cy="96" r={radius} stroke={primaryColor} strokeWidth="16" fill="none"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" rotation="-90" origin="96, 96" />
          </Svg>
          <View style={styles.circleText}>
            <Text style={[styles.caloriesConsumed, { color: cardTextColor }]}>{caloriesConsumed}</Text>
            <Text style={styles.caloriesGoal}>/ {caloriesGoal} kcal</Text>
          </View>
        </View>
      </View>

      {/* CARTE MACRONUTRIMENTS */}
      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}> 
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Macronutriments</Text>
        {macronutrientsList.map((macro) => {
          const progress = macro.goal > 0 ? (macro.consumed / macro.goal) * 100 : 0;
          return (
            <View key={macro.name} style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Text style={[styles.macroName, { color: cardTextColor }]}>{macro.name}</Text>
                <Text style={styles.macroValues}>{macro.consumed}{macro.unit} / {macro.goal}{macro.unit}</Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: borderColor }]}>
                <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: macro.color }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* CARTE PROCHAINE ACTIVITÉ */}
      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}> 
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Prochaine activité</Text>
        <View style={[styles.activityBox, { backgroundColor: mutedColor + '20', borderLeftColor: primaryColor }]}>
          <View style={[styles.activityIcon, { backgroundColor: primaryColor }]}>
            <Text style={{ fontSize: 22 }}>💪</Text>
          </View>
          <View>
            <Text style={[styles.activityName, { color: cardTextColor }]}>{nextActivity.name}</Text>
            <Text style={[styles.activityDuration, { color: mutedColor }]}>{nextActivity.duration}</Text>
          </View>
        </View>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 24, alignSelf: "center", width: "100%" },
  header: { marginBottom: 32 },
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18 },
  bold: { fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 4 },
  notificationBtn: { position: "relative", padding: 8 },
  notificationDot: { position: "absolute", top: 6, right: 6, width: 10, height: 10, borderRadius: 999 },
  mainActionBtn: { borderRadius: 20, padding: 20, flexDirection: "row", gap: 10, justifyContent: "center", alignItems: "center", marginBottom: 32 },
  mainActionText: { fontSize: 16, fontWeight: "700" },
  card: { borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 14 },
  circleContainer: { alignItems: "center", justifyContent: "center", marginBottom: 12 },
  circleText: { position: "absolute", alignItems: "center" },
  caloriesConsumed: { fontSize: 28, fontWeight: "800" },
  caloriesGoal: { fontSize: 13, color: "#6B7280" },
  remaining: { textAlign: "center", fontSize: 13 },
  macroBlock: { marginBottom: 16 },
  macroHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  macroName: { fontWeight: "600" },
  macroValues: { fontSize: 12, color: "#6B7280" },
  progressBarBg: { width: "100%", height: 12, borderRadius: 999, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 999 },
  activityBox: { flexDirection: "row", gap: 12, borderRadius: 14, padding: 16, borderLeftWidth: 4, alignItems: "center" },
  activityIcon: { width: 48, height: 48, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  activityName: { fontWeight: "700" },
  activityDuration: { fontSize: 12 },
});