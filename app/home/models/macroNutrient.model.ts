interface Progression {
    now: number
    objective: number
}

interface MacroNutrients {
    proteine: Progression
    carbs: Progression
    fat: Progression
}

export default MacroNutrients