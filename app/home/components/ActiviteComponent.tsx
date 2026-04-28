import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, View } from "react-native";
import Activite from "../models/activity.model";
import styles from "../styles/home.style";

interface ActiviteProps {
    activity: Activite
}

const ActiviteComponent = ({ activity }: ActiviteProps) => {

    const mutedColor = useThemeColor({}, 'mutedForeground');
    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');

    return <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
        <Text style={[styles.cardTitle, { color: cardTextColor }]}>Prochaine activité</Text>
        <View style={[styles.activityBox, { backgroundColor: mutedColor + '20', borderLeftColor: primaryColor }]}>
            <View style={[styles.activityIcon, { backgroundColor: primaryColor }]}>
                <Text style={{ fontSize: 22 }}>💪</Text>
            </View>
            <View>
                <Text style={[styles.activityName, { color: cardTextColor }]}>{activity.name}</Text>
                <Text style={[styles.activityDuration, { color: mutedColor }]}>{activity.duration}</Text>
            </View>
        </View>
    </View>
}

export default ActiviteComponent