import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Calorie from "../models/calorie.model";
import styles from "../styles/home.style";

interface CalorieProps {
    calorie: Calorie
}

const CalorieComponent = ({calorie}: CalorieProps) => {

    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');

    // --- LOGIQUE D'AFFICHAGE ---
    const caloriesConsumed = calorie.now;
    const caloriesGoal = calorie.objective;
    const caloriesProgress = caloriesGoal > 0 ? (caloriesConsumed / caloriesGoal) * 100 : 0;

    const radius = 88;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - Math.min(caloriesProgress, 100) / 100);

    return <View
        style={[styles.card, { backgroundColor: cardColor, borderColor }]}
        accessible={true}
        accessibilityLabel={`Calories consommées : ${caloriesConsumed} sur ${caloriesGoal} kcal.`}
    >
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Calories du jour</Text>
        <View style={styles.circleContainer}>
            <Svg width={192} height={192} viewBox="0 0 192 192">
                <Circle cx="96" cy="96" r={radius} stroke={borderColor} strokeWidth="16" fill="none" />
                <Circle cx="96" cy="96" r={radius} stroke={primaryColor} strokeWidth="16" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round" rotation="-90" origin="96, 96" />
            </Svg>
            <View style={styles.circleText}>
                <Text style={[styles.caloriesConsumed, { color: cardTextColor }]}>{caloriesConsumed}</Text>
                <Text style={styles.caloriesGoal}>/ {caloriesGoal} kcal</Text>
            </View>
        </View>
    </View>
}

export default CalorieComponent;