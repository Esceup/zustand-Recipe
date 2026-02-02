import { create } from "zustand";
import { generatedId } from "../function/generatedId";
import type { IIngredient } from "../types/types";



interface IngredientsStore {
    Ingredients: IIngredient[];
    addNewIngredient: (title: string, unit?: string) => void;
    searchIngredient: (title: string) => IIngredient[];
}

export const storeIngredients = create<IngredientsStore>((set, get) => ({

    Ingredients: [
        { id: generatedId(), title: 'Картофель'},
        { id: generatedId(), title: 'Лук'},
        { id: generatedId(), title: 'Морковь'},
        { id: generatedId(), title: 'Помидоры'},
        { id: generatedId(), title: 'Курица'},
        { id: generatedId(), title: 'Говядина'},
        { id: generatedId(), title: 'Свинина'},
        { id: generatedId(), title: 'Рис'},
        { id: generatedId(), title: 'Соль'},
        { id: generatedId(), title: 'Перец'},
        { id: generatedId(), title: 'Мука'},
        { id: generatedId(), title: 'Яйца'},
        { id: generatedId(), title: 'Молоко'},
        { id: generatedId(), title: 'Сметана'},
    ],

    addNewIngredient: (title) => {
        const newIngredient:IIngredient = {
            id: generatedId(),
            title: title
        }
        set(state => ({
            Ingredients: [...state.Ingredients, newIngredient]
        }))
    },
    
    searchIngredient: (title) => {
        const { Ingredients } = get()
        const lowerTitle = title.toLowerCase()

        return Ingredients.filter(item => item.title.toLowerCase().includes(lowerTitle))
    }
}))