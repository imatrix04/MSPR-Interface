import * as ImagePicker from "expo-image-picker";

export const pickImage = async (): Promise<string> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        alert("Désolé, nous avons besoin de la permission pour accéder à vos photos !");
        throw Error('Permission non accordé');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        // FIXME: Deprecated.
        // This is deprecated. We need to use ImagePicker.MediaType
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri;
    }
    return '';
};

export const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
        alert("Désolé, nous avons besoin de la permission pour accéder à la caméra !");
        throw Error('Permission non accordé');
    }

    const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri;
    }

    return '';
};