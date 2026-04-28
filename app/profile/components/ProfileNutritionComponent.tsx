import { useThemeColor } from "@/hooks/use-theme-color"
import { Text, View } from "react-native"
import putSaveProfileResponse from "../models/putSaveProfile.model"
import styles from "../styles/profile.style"
import CheckboxComponent from "./CheckBoxComponent"
import SelectorComponent from "./SelectorComponent"

interface ProfileNutritionProps {
    profile: putSaveProfileResponse
    setProfile: React.Dispatch<React.SetStateAction<putSaveProfileResponse>>
}

const ProfileNutritionComponent = ({ profile, setProfile }: ProfileNutritionProps) => {

    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const borderColor = useThemeColor({}, 'border');
    const primaryColor = useThemeColor({}, 'primary');;

    return (
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
            <Text style={[styles.cardTitle, { color: primaryColor }]}>🥗 Paramètres Nutrition</Text>

            <SelectorComponent
                label="Objectif de santé"
                options={["Perte de poids", "Prise de masse", "Équilibre", "Performance"]}
                selectedValue={profile.nutritionGoal}
                onSelect={(v: string) => setProfile({ ...profile, nutritionGoal: v })}
            />

            <SelectorComponent
                label="Préférences alimentaires"
                options={["Omnivore", "Végétarien", "Végétalien", "Poisson uniquement"]}
                selectedValue={profile.diet}
                onSelect={(v: string) => setProfile({ ...profile, diet: v })}
            />

            <View style={styles.section}>
                <Text style={[styles.label, { color: cardTextColor }]}>Allergies & Intolérances</Text>
                <View style={styles.checkboxContainer}>
                    {/* Utilisation du nouveau composant Checkbox */}
                    {Object.entries(profile.allergies).map(([key, value]) => (
                        <CheckboxComponent
                            key={key}
                            label={key}
                            value={value}
                            onChange={() => setProfile({ ...profile, allergies: { ...profile.allergies, [key]: !value } })}
                        />
                    ))}
                </View>
            </View>
        </View>
    )
}

export default ProfileNutritionComponent