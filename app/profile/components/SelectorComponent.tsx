import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/profile.style";

interface SelectProps {
    label: string,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void
}

const SelectorComponent = ({ label, options, selectedValue, onSelect }: SelectProps) => {

    const cardTextColor = useThemeColor({}, 'cardForeground');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');
    const primaryForeground = useThemeColor({}, 'primaryForeground');
    const mutedBg = useThemeColor({}, 'muted');

    return (
        <View style={styles.section}>
            <Text style={[styles.label, { color: cardTextColor }]}>{label}</Text>
            <View style={styles.chipContainer}>
                {options.map((opt: string) => (
                    <TouchableOpacity
                        key={opt}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selectedValue === opt }}
                        style={[
                            styles.chip,
                            { borderColor },
                            selectedValue === opt
                                ? { backgroundColor: primaryColor, borderColor: primaryColor }
                                : { backgroundColor: mutedBg }
                        ]}
                        onPress={() => onSelect(opt)}
                    >
                        <Text style={{
                            color: selectedValue === opt ? primaryForeground : cardTextColor,
                            fontSize: 13,
                            fontWeight: "600"
                        }}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default SelectorComponent
