import { useThemeColor } from '@/hooks/use-theme-color';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import ActiviteComponent from '../home/components/ActiviteComponent';
import AnalyzeComponent from '../home/components/AnalyzeComponent';
import CalorieComponent from '../home/components/CalorieComponent';
import HeaderComponent from '../home/components/HeaderComponent';
import MacroNutrientComponent from '../home/components/MacroNutrientComponent';
import { getCalorieResume } from '../home/services/resume.service';
import styles from '../home/styles/home.style';

export default function Home() {
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
          setFirstName(JSON.parse(userString).firstName); 
        }

        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          const response = await getCalorieResume(token)

          if (response.ok) {
            setMacros(response); 
          }
        }
      } catch (error) {
        console.error("Erreur de récupération", error);
      }
    };
    
    fetchData();
  }, []);

  const backgroundColor = useThemeColor({}, 'background');

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
    
      <HeaderComponent
        name={firstName}
      />

      <AnalyzeComponent/>

      <CalorieComponent
        calorie={macros.calories}
      />

      <MacroNutrientComponent
        macros={macros}
      />

      <ActiviteComponent
        activity={nextActivity}
      />
      
    </ScrollView>
  );
}
