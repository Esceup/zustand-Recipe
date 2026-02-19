import { create } from "zustand";
import type { IMenuWeek } from "../types/types";
import { generatedId } from "../function/generatedId";
import { createJSONStorage, persist } from "zustand/middleware";


interface MenuWeekStore {
    menuWeek: IMenuWeek[];
    addNewMenu: (title: string) => void;
    addIncludeRecipe: (id: string, idRecipe: string, titleRecipe: string) => void;
    deleteMenu: (id: string) => void;
    deleteInclideMenuItem: (idMenuWeek: string, idDeleteRecipeItem: string) => void;
}

export const useMenuWeek = create<MenuWeekStore>()(persist((set, get) => ({
    menuWeek: [{id: generatedId(), title: '5 дней', includesRecipe: [{title: 'test', id: generatedId()}]}],
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
    addIncludeRecipe: (idMenuWeekItem, idRecipe, titleRecipe) => {
        set(state => ({
           menuWeek: state.menuWeek.map((item) => {
                if(item.id === idMenuWeekItem) {

                    if(item.includesRecipe.some(item => item.title === titleRecipe)) {
                        return item
                    }

                    return {
                        ...item,
                        includesRecipe: [...item.includesRecipe, {id: idRecipe, title: titleRecipe}]
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
    deleteInclideMenuItem: (idMenuWeek, idDeleteRecipeItem) => {
        
        set(state => ({
            menuWeek: state.menuWeek.map(menuItem => {
            if(menuItem.id == idMenuWeek) {
                return {
                    ...menuItem, 
                    includesRecipe: menuItem.includesRecipe.filter(item => item.id !== idDeleteRecipeItem)
                }}
            return menuItem}
            )
        }))
    }

}),
    {
        name: 'menuWeek-storage',
        storage: createJSONStorage(() => localStorage)
    }
))