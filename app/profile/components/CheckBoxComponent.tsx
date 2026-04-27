import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/profile.style";

interface CustomCheckboxProps {
    label: string,
    value: boolean,
    onChange: () => void
}

const CheckboxComponent = ({ label, value, onChange }: CustomCheckboxProps) => {

    const cardTextColor = useThemeColor({}, 'cardForeground');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryForeground = useThemeColor({}, 'primaryForeground');
    const mutedBg = useThemeColor({}, 'muted');

    return (
        <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value }}
            onPress={onChange}
            style={styles.checkboxRow}
        >
            <View style={[
                styles.checkbox,
                {
                    borderColor: value ? primaryColor : borderColor,
                    backgroundColor: value ? primaryColor : mutedBg
                }
            ]}>
                {/* On ajoute une petite encoche blanche quand c'est coché */}
                {value && <Text style={{ color: primaryForeground, fontWeight: "bold", fontSize: 14, marginTop: -2 }}>✓</Text>}
            </View>
            <Text style={{ color: cardTextColor }}>{label}</Text>
        </TouchableOpacity>
    )
};

export default CheckboxComponent