import getAnalysisResponse from "../models/analysis.response";

export const getCalorieResume = async (token: string): Promise<getAnalysisResponse> => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/calories/resume`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });

    return {
        ...response.json(),
        ok: response.ok
    }
}
