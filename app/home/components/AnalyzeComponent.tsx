import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { Pressable, Text } from "react-native";
import styles from "../styles/home.style";

const AnalyzeComponent = () => {
    const router = useRouter();

    const primaryColor = useThemeColor({}, 'primary');
    const primaryForeground = useThemeColor({}, 'primaryForeground');

    return <Pressable
        style={[styles.mainActionBtn, { backgroundColor: primaryColor }]}
        accessibilityRole="button"
        accessibilityLabel="Analyser un repas avec la caméra"
        accessibilityHint="Ouvre l'appareil photo pour calculer les calories de votre plat"
        onPress={() => router.push("/coach?mode=nutrition")}
    >
        <Camera size={32} color={primaryForeground} />
        <Text style={[styles.mainActionText, { color: primaryForeground }]}>Analyser mon repas</Text>
    </Pressable>
}

export default AnalyzeComponent;