import { pickImage, takePhoto } from "@/app/utils/media-control";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import { Alert, Button, Image, Text, TouchableOpacity, View } from "react-native";
import { handleAnalyze } from "../hooks/useHandleAnalyze";
import { mealSuggestions } from "../mocks/nutrition.mock";
import { NutritionAnalysis } from "../models/analysis.model";



export const Nutrition = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<NutritionAnalysis | null>(null);

    const handleSelectedImage = async (action: 'pick' | 'take') => {
        switch (action) {
            case 'pick':
                const pick = await pickImage()
                setSelectedImage(pick)
                break;

            case "take":
                const image = await takePhoto()
                setSelectedImage(image)
                break;
        }
    }
 
    const handleConfirmIA = () => {
        setIsConfirmed(true);
        Alert.alert("Merci !", "Votre confirmation aide l'IA à apprendre.");
    };

    const textColor = useThemeColor({}, 'text');
    const cardColor = useThemeColor({}, 'card');
    const cardTextColor = useThemeColor({}, 'cardForeground');
    const mutedColor = useThemeColor({}, 'mutedForeground');
    const primaryColor = useThemeColor({}, 'primary');
    const borderColor = useThemeColor({}, 'border');

    const handleReset = () => {
        setSelectedImage(null);
        setAnalysisResult(null);
        setIsConfirmed(false);
    };

    // TODO: Decompose these further
    return (
        <>
            <View style={{ marginBottom: 24 }}>
                {/* Analyse Image */}
                <View style={{ marginBottom: 16 }}>
                    {selectedImage && selectedImage !== '' && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: "100%", height: 220, marginBottom: 12, borderRadius: 12 }}
                            accessibilityLabel="Photo du plat à analyser"
                        />
                    )}
                    <View style={{ gap: 8 }}>
                        <Button title="Choisir une image" onPress={() => handleSelectedImage('pick')} accessibilityLabel="Ouvrir la galerie photo" />
                        <Button title="Prendre une photo" onPress={() => handleSelectedImage('take')} accessibilityLabel="Ouvrir l'appareil photo" />
                    </View>

                    {selectedImage && selectedImage !== '' && (
                        <View style={{ marginTop: 8, gap: 8 }}>
                            <Button title="Analyser le plat" onPress={() => {
                                setIsConfirmed(false)
                                handleAnalyze(selectedImage)
                            }} color={primaryColor} accessibilityLabel="Lancer l'analyse IA" />
                            <Button title="Réinitialiser" onPress={handleReset} color="#EF4444" accessibilityLabel="Supprimer la photo" />
                        </View>
                    )}
                </View>
                {analysisResult && (
                    <View
                        style={{ backgroundColor: cardColor, padding: 16, borderRadius: 12, marginBottom: 16, borderColor, borderWidth: 1 }}
                        accessible={true}
                        accessibilityLabel={`Résultat : ${analysisResult.dishName}`}
                    >
                        <Text style={{ fontWeight: "bold", fontSize: 18, color: cardTextColor }}>{analysisResult.dishName}</Text>
                        <Text style={{ color: mutedColor }}>Précision IA : {analysisResult.confidence}%</Text>
                        <View style={{ marginVertical: 8, borderTopWidth: 1, borderTopColor: borderColor, paddingTop: 8 }}>
                            <Text style={{ color: cardTextColor }}>Calories : {analysisResult.calories}</Text>
                            <Text style={{ color: cardTextColor }}>Protéines : {analysisResult.proteins}g | Glucides : {analysisResult.carbs}g</Text>
                        </View>

                        <TouchableOpacity
                            onPress={handleConfirmIA}
                            disabled={isConfirmed}
                            style={{
                                marginTop: 10,
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: isConfirmed ? "#D1FAE5" : "#10B981",
                                alignItems: "center"
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Confirmer l'exactitude de l'IA"
                        >
                            <Text style={{ color: isConfirmed ? "#065F46" : "white", fontWeight: "bold" }}>
                                {isConfirmed ? "✓ Analyse confirmée" : "Est-ce le bon plat ? Confirmer"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View
                    style={{ backgroundColor: cardColor, padding: 12, borderLeftWidth: 4, borderLeftColor: primaryColor, borderRadius: 8, marginBottom: 16, borderColor, borderWidth: 1 }}
                    accessible={true}
                >
                    <Text style={{ fontWeight: "bold", color: cardTextColor, marginBottom: 4 }}>Conseil IA</Text>
                    <Text style={{ color: mutedColor }}>L'IA a détecté un déficit en protéines hier.</Text>
                </View>

                <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8, color: textColor }}>Suggestions de repas</Text>
                {mealSuggestions.map((meal) => (
                    <View key={meal.id} style={{ backgroundColor: cardColor, padding: 12, borderRadius: 12, marginBottom: 8, borderColor, borderWidth: 1 }}>
                        <Text style={{ fontWeight: "bold", color: cardTextColor }}>{meal.name}</Text>
                        <Text style={{ color: mutedColor }}>{meal.calories} kcal • {meal.proteins}g Protéines</Text>
                        <Text style={{ color: mutedColor }}>Prix: {meal.price} • Temps: {meal.time}</Text>
                        <View style={{ marginTop: 8 }}>
                            <Button title="Voir la recette" onPress={() => Alert.alert("Recette", "Fonctionnalité à venir")} />
                        </View>
                    </View>
                ))}
            </View>
        </>
    )
}