import nutrientTranslator from './nutrient_translator.json';
import nutrientDV from './nutrition_dv.json';

export interface Food {
    [key: string]: string | number | string[] | null;
}

export interface NutritionStats {
    [x: string]: {
        intake: number;
        DV: number;
        unit: string;
    };
}

interface nutrientData {
    "total_cal": string;
    "fat_g": string;
    "sat_fat_g": string;
    "trans_fat_g": string;
    "cholesterol_mg": string;
    "sodium_mg": string;
    "carbs_g": string;
    "fiber_g": string;
    "sugars_g": string;
    "protein_g": string;
}

const translator = nutrientTranslator as nutrientData;
const DV = nutrientDV as nutrientData;

export const translateData = (foods: Food[]): NutritionStats => {
    const translatedData: NutritionStats = {};
    for (const key of Object.keys(translator)) {
        translatedData[translator[key as keyof nutrientData]] = {
            intake: 0,
            DV: parseInt(DV[key as keyof nutrientData]),
            unit: key.split('_')[key.split('_').length - 1]
        }
    }
    for (const food of foods) {
        for (const key of Object.keys(translator)) {
            translatedData[translator[key as keyof nutrientData]].intake += food[key] as number;
        }
    }
    return translatedData;
}