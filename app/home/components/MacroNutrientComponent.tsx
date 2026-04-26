import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, View } from "react-native";
import MacroNutrients from "../models/macroNutrient.model";
import styles from "../styles/home.style";

interface MacroNutrientProps {
    macros: MacroNutrients
}

const MacroNutrientComponent = ({ macros }: MacroNutrientProps) => {

    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const borderColor = useThemeColor({}, 'border');

    const macronutrientsList = [
        { name: "Protéines", consumed: macros.proteine.now, goal: macros.proteine.objective, unit: "g", color: "#F59E0B" },
        { name: "Glucides", consumed: macros.carbs.now, goal: macros.carbs.objective, unit: "g", color: "#3B82F6" },
        { name: "Lipides", consumed: macros.fat.now, goal: macros.fat.objective, unit: "g", color: "#EF4444" }
    ];

    return <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Macronutriments</Text>
        {macronutrientsList.map((macro) => {
            const progress = macro.goal > 0 ? (macro.consumed / macro.goal) * 100 : 0;
            return (
                <View key={macro.name} style={styles.macroBlock}>
                    <View style={styles.macroHeader}>
                        <Text style={[styles.macroName, { color: cardTextColor }]}>{macro.name}</Text>
                        <Text style={styles.macroValues}>{macro.consumed}{macro.unit} / {macro.goal}{macro.unit}</Text>
                    </View>
                    <View style={[styles.progressBarBg, { backgroundColor: borderColor }]}>
                        <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: macro.color }]} />
                    </View>
                </View>
            );
        })}
    </View>
}

export default MacroNutrientComponent;