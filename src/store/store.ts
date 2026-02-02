 import  {create}  from 'zustand'
import type { IRecipe } from '../types/types'
import { generatedId } from '../function/generatedId';
import { createJSONStorage, persist } from 'zustand/middleware'




interface RecipeStore {
    recipesList: IRecipe[],
    createRecipe: (recipeData: Omit<IRecipe, "id">) => void,
    updateRecipe: (id: string, recipeData: Partial<Omit<IRecipe, 'id'>>) => void,
    removeRecipe: (id: string) => void
}

export const useRecipesStore = create<RecipeStore>()(persist((set, get) => ({

    recipesList: [
         {
            id: generatedId(),
            title: "Голубцы",
            desc: 'Нежные голубцы в капусте, Нежные голубцы в капусте, Нежные голубцы в капусте', 
            ingredients: [{id: generatedId(), title: 'Фарш', unit: '500 грамм'}, {id: generatedId(),title: 'Лук', unit: '2 шт.'} ],
            steps: [{id: generatedId(), title: 'К фаршу добавить мелкопорезанный лук, муку и перемешать'},]
        },
        {
            id: generatedId(),
            title: "Котлеты",
            desc: '',      
            ingredients: [{id: generatedId(), title: 'Фарш', unit: '500 грамм'}],
            steps: [{id: generatedId(), title: 'К фаршу добавить мелкопорезанный лук, муку и перемешать'},]
        },
    ],

    createRecipe: (recipeData) => {
        const newRecipe: IRecipe = {
            id: generatedId(),
            ...recipeData
        } 
        

        set(state => ({
            recipesList: [...state.recipesList, newRecipe]
            
        }))
        
    },

    updateRecipe: (id, recipeData) => {    
       set(state => ({
        recipesList: state.recipesList.map(recipe => 
            recipe.id === id 
            ? {...recipe, ...recipeData} 
            : recipe
        )
       }))

    },

    removeRecipe: (id: string) => {
        const result = confirm("Точно хотите удалить?")
        if(!result) return false
        const { recipesList } = get()
        set({
            recipesList: recipesList.filter(recipe => recipe.id !== id)
        })
    },
   
}),
    {
        name: 'recipe-storage',
        storage: createJSONStorage(() => localStorage)
    }
))
