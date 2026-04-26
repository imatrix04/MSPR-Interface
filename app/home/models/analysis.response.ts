interface getAnalysisResponse {
    calories: {
        objective: number;
        now: number;
    };
    proteine: {
        objective: number;
        now: number;
    };
    carbs: {
        objective: number;
        now: number;
    };
    fat: {
        objective: number;
        now: number;
    };
    ok?: boolean
}

export default getAnalysisResponse;