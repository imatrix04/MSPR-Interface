export interface getAiPredictionResponse {
    success: string,
    filename: string,
    prediction: string,
    confidence_percent: number
    ok: boolean
}

export interface postAiSaveDataCalories {
    added: {
        calories: number
    }
    ok: boolean
}