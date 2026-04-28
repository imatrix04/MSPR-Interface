import { useThemeColor } from "@/hooks/use-theme-color"
import { Text, TextInput, View } from "react-native"
import putSaveProfileResponse from "../models/putSaveProfile.model"
import styles from "../styles/profile.style"
import CheckboxComponent from "./CheckBoxComponent"
import SelectorComponent from "./SelectorComponent"

interface ProfileSportProps {
    profile: putSaveProfileResponse
    setProfile: React.Dispatch<React.SetStateAction<putSaveProfileResponse>>
}

const ProfileSportComponent = ({profile, setProfile}: ProfileSportProps) => {

    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const mutedColor = useThemeColor({}, 'mutedForeground');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');

    return (
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
            <Text style={[styles.cardTitle, { color: primaryColor }]}>💪 Paramètres Sportifs</Text>

            <SelectorComponent
                label="Objectif d'entraînement"
                options={["Perte de graisse", "Musculation", "Endurance", "Santé générale"]}
                selectedValue={profile.sportGoal}
                onSelect={(v: string) => setProfile({ ...profile, sportGoal: v })}
            />

            <SelectorComponent
                label="Niveau de forme actuel"
                options={["Débutant", "Intermédiaire", "Avancé"]}
                selectedValue={profile.fitnessLevel}
                onSelect={(v: string) => setProfile({ ...profile, fitnessLevel: v })}
            />

            <View style={styles.section}>
                <Text style={[styles.label, { color: cardTextColor }]}>Équipement disponible</Text>
                <View style={styles.checkboxContainer}>
                    {/* Utilisation du nouveau composant Checkbox */}
                    {Object.entries(profile.equipment).map(([key, value]) => (
                        <CheckboxComponent
                            key={key}
                            label={key}
                            value={value}
                            onChange={() => setProfile({ ...profile, equipment: { ...profile.equipment, [key]: !value } })}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.label, { color: cardTextColor }]}>Limitations physiques (Blessures)</Text>
                <TextInput
                    value={profile.limitations}
                    onChangeText={t => setProfile({ ...profile, limitations: t })}
                    style={[styles.input, { borderColor: borderColor, backgroundColor: cardColor, color: cardTextColor, height: 80 }]}
                    multiline
                    placeholder="Ex: Douleur épaule, asthme..."
                    placeholderTextColor={mutedColor}
                />
            </View>
        </View>
    )
}

export default ProfileSportComponent