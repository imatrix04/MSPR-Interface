// TODO: Follow the react conventions.
// In React, files shouldn't be larger than 150 lines.
// There are 235 lines in this file. We need to optimize
// it or the page will be heavy and become hard to
// maintain.

import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Nutrition } from '../coach/nutrition/components/Nutrition';
import { Sport } from '../coach/sport/components/Sport';

type CoachMode = "nutrition" | "sport";

export default function Coach() {
  const params = useLocalSearchParams();
  const [mode, setMode] = useState<CoachMode>("nutrition");
  const [firstName, setFirstName] = useState(""); 

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

  const backgroundColor = useThemeColor({}, 'background');
  const cardTextColor = useThemeColor({}, 'cardForeground');
  const mutedColor = useThemeColor({}, 'mutedForeground');

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
        <Nutrition/>
      )}

      {mode === "sport" && (
        <Sport/>
      )}
    </ScrollView>
  );
}