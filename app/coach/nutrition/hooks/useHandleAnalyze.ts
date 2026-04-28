import { Alert } from "react-native";
import { getAiPredictionResponse, postAiSaveDataCalories } from "../models/ai-response.model";
import { getAiPrediction, postAiSave } from "../services/ai.service";

export const handleAnalyze = async (selectedImage: string) => {
    if (!selectedImage) return;

    try {
      const formData: FormData = new FormData();
      formData.append("image", {
        uri: selectedImage,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const aiData: getAiPredictionResponse = await getAiPrediction(formData);

      if (aiData.success && aiData.prediction) {

        const aiSave: postAiSaveDataCalories = await postAiSave(aiData.prediction)

        if (aiSave.ok) {
          Alert.alert(
            "Analyse réussie", 
            `Plat détecté : ${aiData.prediction}\n+${aiSave.added.calories} kcal ajoutées !`
          );
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de joindre le serveur. Vérifiez votre connexion.");
    }
  };