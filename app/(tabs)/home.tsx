import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Bell, Camera } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { useThemeColor } from '@/hooks/use-theme-color';

export default function Home() {
  // Données conservées
  const userName = "Marie";
  const caloriesConsumed = 1450;
  const caloriesGoal = 2000;
  const caloriesProgress = (caloriesConsumed / caloriesGoal) * 100;

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'mutedForeground');
  const cardColor = useThemeColor({}, 'card');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const primaryForeground = useThemeColor({}, 'primaryForeground');
  const destructiveColor = useThemeColor({}, 'destructive');

  const macros = [
    { name: "Protéines", consumed: 85, goal: 120, unit: "g", color: "#10B981" },
    { name: "Glucides", consumed: 160, goal: 200, unit: "g", color: "#3B82F6" },
    { name: "Lipides", consumed: 45, goal: 60, unit: "g", color: "#F59E0B" },
  ];

  const nextActivity = {
    name: "Séance Haut du corps",
    duration: "45 min",
  };

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - caloriesProgress / 100);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}> 
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: textColor }]}> 
              Bonjour <Text style={styles.bold}>{userName}</Text> !{"\n"}
              Prêt(e) pour tes objectifs ?
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}> 
              Tes données sont à jour.
            </Text>
          </View>
          <Pressable style={styles.notificationBtn}>
            <Bell size={24} color={textColor} />
            <View style={[styles.notificationDot, { backgroundColor: destructiveColor }]} />
          </Pressable>
        </View>
      </View>

      <Pressable style={[styles.mainActionBtn, { backgroundColor: primaryColor }]}> 
        <Camera size={32} color={primaryForeground} />
        <Text style={[styles.mainActionText, { color: primaryForeground }]}>📸 Analyser mon repas</Text>
      </Pressable>

      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}> 
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Calories du jour</Text>
        <View style={styles.circleContainer}>
          <Svg width={192} height={192} viewBox="0 0 192 192">
            <Circle cx="96" cy="96" r={radius} stroke="#E5E7EB" strokeWidth="16" fill="none" />
            <Circle cx="96" cy="96" r={radius} stroke="#10B981" strokeWidth="16" fill="none"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" rotation="-90" origin="96, 96" />
          </Svg>
          <View style={styles.circleText}>
            <Text style={styles.caloriesConsumed}>{caloriesConsumed}</Text>
            <Text style={styles.caloriesGoal}>/ {caloriesGoal} kcal</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}> 
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Macronutriments</Text>
        {macros.map((macro) => {
          const progress = (macro.consumed / macro.goal) * 100;
          return (
            <View key={macro.name} style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>{macro.name}</Text>
                <Text style={styles.macroValues}>{macro.consumed}{macro.unit} / {macro.goal}{macro.unit}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: macro.color }]} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}> 
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Prochaine activité</Text>
        <View style={styles.activityBox}>
          <View style={styles.activityIcon}><Text style={{ fontSize: 22 }}>💪</Text></View>
          <View>
            <Text style={styles.activityName}>{nextActivity.name}</Text>
            <Text style={styles.activityDuration}>{nextActivity.duration}</Text>
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
  progressBarBg: { width: "100%", height: 12, backgroundColor: "#E5E7EB", borderRadius: 999, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 999 },
  activityBox: { flexDirection: "row", gap: 12, backgroundColor: "#EFF6FF", borderRadius: 14, padding: 16, borderLeftWidth: 4, borderLeftColor: "#3B82F6", alignItems: "center" },
  activityIcon: { width: 48, height: 48, backgroundColor: "#3B82F6", borderRadius: 999, alignItems: "center", justifyContent: "center" },
  activityName: { fontWeight: "700", color: "#1E3A5F" },
  activityDuration: { fontSize: 12, color: "#6B7280" },
});