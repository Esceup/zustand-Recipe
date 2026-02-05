import { create } from "zustand";
import { generatedId } from "../function/generatedId";
import type { IIngredient } from "../types/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface IngredientsStore {
    Ingredients: IIngredient[];
    addNewIngredient: (title: string, unit: string) => void;
    searchIngredient: (title: string) => IIngredient[];
    deleteIngredient: (id: string) => void;
}

export const storeIngredients = create<IngredientsStore>()(persist((set, get) => ({

    Ingredients: [
        { id: generatedId(), title: 'Картофель', unit: '3 шт'},
        { id: generatedId(), title: 'Лук', unit: '1 шт'},
        { id: generatedId(), title: 'Морковь', unit: '1 шт'},
        { id: generatedId(), title: 'Помидоры', unit: '1 шт'},
        { id: generatedId(), title: 'Курица', unit: '500 гр'},
        { id: generatedId(), title: 'Говядина', unit: '500 гр'},
        { id: generatedId(), title: 'Свинина', unit: '500 гр'},
        { id: generatedId(), title: 'Рис', unit: '200 гр'},
        { id: generatedId(), title: 'Соль', unit: '1 ст.л'},
        { id: generatedId(), title: 'Перец', unit: '1 шт'},
        { id: generatedId(), title: 'Мука', unit: '100 гр'},
        { id: generatedId(), title: 'Яйца', unit: '1 шт'},
        { id: generatedId(), title: 'Молоко', unit: '70 мл'},
        { id: generatedId(), title: 'Сметана', unit: '1 ст.л'},
    ],

    addNewIngredient: (title, unit) => {
        const newIngredient:IIngredient = {
            id: generatedId(),
            title: title,
            unit: unit
        }
        set(state => ({
            Ingredients: [...state.Ingredients, newIngredient]
        }))
    },
    
    searchIngredient: (title) => {
        const { Ingredients } = get()
        const lowerTitle = title.toLowerCase()

        return Ingredients.filter(item => item.title.toLowerCase().includes(lowerTitle))
    },
    deleteIngredient: (id) => {
        const { Ingredients } = get()
        set({
            Ingredients: Ingredients.filter(item => item.id !== id)
        })
    }
}),
{
    name: "ingredient-storage",
    storage: createJSONStorage(() => localStorage)
}

))