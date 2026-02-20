 import  {create}  from 'zustand'
import type { IRecipe } from '../types/types'
import { generatedId } from '../function/generatedId';
import { createJSONStorage, persist } from 'zustand/middleware'




interface RecipeStore {
    recipesList: IRecipe[];
    createRecipe: (recipeData: Omit<IRecipe, "id">) => void;
    updateRecipe: (id: string, recipeData: Partial<Omit<IRecipe, 'id'>>) => void;
    removeRecipe: (id: string) => void;
}

export const useRecipesStore = create<RecipeStore>()(persist((set, get) => ({

    recipesList: [
         {
            id: generatedId(),
            title: "Блины с начинкой",
            desc: 'Церепт на 3 блина. Начинка: сыр и ветчина, яблоки и др. Предварительно разогреть сковороду, чтобы первый билн получился', 
            ingredients: [{id: generatedId(), title: 'Молоко', unit: '100 мл'}, {id: generatedId(),title: 'Яйцо', unit: '1 шт.'}, {id: generatedId(),title: 'Мука', unit: '30 гр'}, {id: generatedId(),title: 'Сахар', unit: '1 ст.л'} ],
            steps: [{id: generatedId(), title: 'Замешать всё в одной миске венчиком'},]
        },
        {
            id: generatedId(),
            title: "Венские вафли",
            desc: 'Рецепт на 4 вафли',      
            ingredients: [{id: generatedId(), title: 'Мука', unit: '100 гр'}, {id: generatedId(), title: 'Сахар', unit: '50 гр'}, {id: generatedId(), title: 'Молоко', unit: '70 мл'}, {id: generatedId(), title: 'Сода', unit: '2/3 ч.л'}, {id: generatedId(), title: 'Слив. масло', unit: '60 гр'}],
            steps: [{id: generatedId(), title: 'Растопить масло с сахаром'}, {id: generatedId(), title: 'Смешать всё венчиком в одной миске'}, {id: generatedId(), title: 'Смазывать вафельницу раст. маслом каждый раз'},]
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

    removeRecipe: (id) => {
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
