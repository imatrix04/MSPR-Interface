interface putSaveProfileResponse {
    name: string,
    nutritionGoal: string, 
    diet: string, 
    budget: string,
    allergies: { 
        Gluten: boolean, 
        Lactose: boolean, 
        Arachides: boolean, 
        Crustaces: boolean 
    },
    sportGoal: string, 
    fitnessLevel: string, 
    equipment: { 
        "Salle de sport": boolean, 
        "Poids à domicile": boolean, 
        "Aucun (Poids du corps)": boolean 
    },
    limitations: string,
    photoUri?: string,
}

export default putSaveProfileResponse