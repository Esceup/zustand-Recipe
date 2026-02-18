import { create } from "zustand";
import type { IMenuWeek } from "../types/types";
import { generatedId } from "../function/generatedId";
import { createJSONStorage, persist } from "zustand/middleware";


interface MenuWeekStore {
    menuWeek: IMenuWeek[];
    addNewMenu: (title: string) => void;
    updateIncludesRecipe: (id: string, addRecipeId: string) => void;
    deleteMenu: (id: string) => void;
}

export const useMenuWeek = create<MenuWeekStore>()(persist((set, get) => ({
    menuWeek: [{id: generatedId(), title: '5 дней', includesRecipe: ['24431eed048448mljqvn1w', '123']}],
    addNewMenu: (title) => {
        const newMenu: IMenuWeek = {
            id: generatedId(),
            title: title,
            includesRecipe: []
        }

        set(state => ({
            menuWeek: [...state.menuWeek, newMenu]
        }))
    },
    updateIncludesRecipe: (id, recipeId) => {
        set(state => ({
            menuWeek: state.menuWeek.map((item) => {
                if(item.id === id) {

                    const normalizeRecipe = item.includesRecipe || []

                    return {
                        ...item,
                        includesRecipe: [...normalizeRecipe, recipeId]
                    }
                }
                return item
            })
        }))
    },

    deleteMenu: (id) => {
        const { menuWeek } = get()

        set({
            menuWeek: menuWeek.filter(item => item.id !== id)
        })
    },

}),
    {
        name: 'menuWeek-storage',
        storage: createJSONStorage(() => localStorage)
    }
))