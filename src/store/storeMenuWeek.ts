import { create } from "zustand";
import type { IMenuWeek } from "../types/types";
import { generatedId } from "../function/generatedId";
import { createJSONStorage, persist } from "zustand/middleware";

interface MenuWeekStore {
    menuWeek: IMenuWeek[];
    addNewMenu: (title: string) => void;
    updateMenu: (id: string) => void;
    deleteMenu: (id: string) => void;
}

export const useMenuWeek = create<MenuWeekStore>()(persist((set, get) => ({
    menuWeek: [{id: generatedId(), title: '5 дней', includesRecipe: ['783483ea7bfd9ml8zzaz0']}],
    addNewMenu: (title) => {
        const newMenu: IMenuWeek = {
            id: generatedId(),
            title: title,
            includesRecipe: null
        }

        set(state => ({
            menuWeek: [...state.menuWeek, newMenu]
        }))
    },
    updateMenu: () => {

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