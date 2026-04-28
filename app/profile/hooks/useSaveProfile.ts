import { Alert } from "react-native";
import putSaveProfileResponse from "../models/putSaveProfile.model";
import { putSaveProfile } from "../services/putSaveProfile";

export const useSaveProfile = async (profile: putSaveProfileResponse) => {
    try {

        const response: boolean = await putSaveProfile(profile);

        if (response) {
            Alert.alert(
                "Succès",
                "Profil sauvegardé avec succès dans la base de données ! L'IA prendra en compte vos critères."
            );
        } else {
            Alert.alert("Erreur", "Impossible de sauvegarder le profil.");
        }
    } catch (error) {
        console.error(error);
        Alert.alert("Erreur", "Problème de connexion au serveur Backend.");
    }
};
