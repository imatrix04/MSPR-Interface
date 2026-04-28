import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export const useLogout = async () => {
    const router = useRouter();
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("userData");
    router.replace("/login");
};
