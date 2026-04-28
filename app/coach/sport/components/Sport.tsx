import { useThemeColor } from "@/hooks/use-theme-color";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { workoutPlan } from "../mocks/workout.mock";

export const Sport = () => {

    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const mutedColor = useThemeColor({}, 'mutedForeground');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    return (
        <View style={{ marginBottom: 24 }}>
            <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: textColor }}
                accessibilityRole="header"
            >
                Programme du jour
            </Text>
            {workoutPlan.map((exercise, idx) => (
                <View
                    key={exercise.id}
                    style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 8, borderColor, borderWidth: 1 }}
                    accessible={true}
                    accessibilityLabel={`Exercice ${idx + 1}: ${exercise.name}. ${exercise.sets}.`}
                >
                    <Text style={{ fontWeight: "bold", color: cardTextColor }}>{idx + 1}. {exercise.name}</Text>
                    <Text style={{ color: mutedColor }}>Séries: {exercise.sets} • Repos: {exercise.rest}</Text>
                    <Text style={{ color: mutedColor }}>Cible: {exercise.target}</Text>
                </View>
            ))}
            <TouchableOpacity
                onPress={() => Alert.alert("Fonctionnalité à venir")}
                style={{ backgroundColor: primaryColor, padding: 16, borderRadius: 12, marginTop: 10 }}
                accessibilityRole="button"
            >
                <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Ajuster ma séance</Text>
            </TouchableOpacity>
        </View>
    )
}