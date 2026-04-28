import AsyncStorage from "@react-native-async-storage/async-storage";
import putSaveProfileResponse from "../models/putSaveProfile.model";

export const putSaveProfile = async (profile: putSaveProfileResponse): Promise<boolean> => {

    const token = await AsyncStorage.getItem("authToken");
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/profil`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // On envoie tout notre objet "profile" au format JSON
        body: JSON.stringify(profile)
    });

    return response.ok
}