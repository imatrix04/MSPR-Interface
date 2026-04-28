import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAiPredictionResponse, postAiSaveDataCalories } from "../models/ai-response.model";

export const getAiPrediction = async (body: FormData): Promise<getAiPredictionResponse> => {
    const aiResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/ai/predict`, {
        method: "POST",
        body: body,
    });

    return {
        ...aiResponse.json(),
        ok: aiResponse.ok
    }
}

export const postAiSave = async (prediction: string): Promise<postAiSaveDataCalories> => {
    const token = await AsyncStorage.getItem("authToken");

    const saveResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/calories/add-from-ai`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prediction: prediction })
    });

    return {
        ...saveResponse.json(),
        ok: saveResponse.ok
    }
}