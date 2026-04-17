import { create } from "zustand";
import type { IMenuWeek } from "../types/types";
import { generatedId } from "../function/generatedId";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";



interface MenuWeekStore {
    loading: boolean;
    error: string | null;
    menuWeek: IMenuWeek[];
    fetchMenuWeek: (userId: string) => Promise<void> 
    addNewMenu: (userId: string, title: string) =>  Promise<void>;
    addIncludeRecipe: (userId: string, id: string, idRecipe: string, titleRecipe: string) =>  Promise<void>;
    // toggleEditMenu: (userId: string, id: string, value: boolean) =>  Promise<void>;
    editTitleMenu: (userId: string, id: string, title: string) =>  Promise<void>;
    deleteMenu: (userId: string, id: string) =>  Promise<void>;
    deleteIncludeMenuItem: (userId: string, idMenuWeek: string, idDeleteRecipeItem: string) =>  Promise<void>;
}

export const useMenuWeek = create<MenuWeekStore>((set, get) => ({
    loading: false,
    error: null,
    menuWeek: [],
    fetchMenuWeek: async (userId) => {
        set({ loading: true, error: null})
        try {
            const colRef = collection(db, 'users', userId, 'menuWeek')
            const snapshot = await getDocs(colRef)
            const items = snapshot.docs.map(menu => ({ id: menu.id, ...menu.data()})) as IMenuWeek[]
            if(items.length === 0) {
                set({ loading: false})
            } else {
                set({ menuWeek: items, loading: false})
            }

        } catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    },
    
    addNewMenu: async (userId, title) => {
        set({ loading: true, error: null})

        try{
            const colRef = collection(db, 'users', userId, 'menuWeek')
            const docRef = await addDoc(colRef, { title, includesRecipe: []})
            const newMenu: IMenuWeek = { id: docRef.id, title, includesRecipe: []}
            set(state => ({ menuWeek: [...state.menuWeek, newMenu], loading: false}))
        } catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    },
    addIncludeRecipe: async (userId, idMenuWeekItem, idRecipe, titleRecipe) => {
        set({ loading: true, error: null})
       


        // set(state => ({
        //    menuWeek: state.menuWeek.map((item) => {
        //         if(item.id === idMenuWeekItem) {

        //             if(item.includesRecipe.some(item => item.title === titleRecipe)) {
        //                 return item
        //             }

        //             return {
        //                 ...item,
        //                 includesRecipe: [...item.includesRecipe, {id: idRecipe, title: titleRecipe}]
        //             }
        //         }
        //         return item
        //    })
            
        // }))
    },
    // toggleEditMenu: async (userId, id, value) => {
    //     set(state => ({
    //         menuWeek: state.menuWeek.map(item => {
    //             if(item.id === id) {
    //                 return {
    //                     ...item,
    //                     editMode: value 
    //                 }
    //             }
    //             return item
    //         })
    //     }))
    // },
    editTitleMenu: async (userId, id, title) => {
       set({ loading: true, error: null})
       try {
        const docRef = doc(db, 'users', userId, 'menuWeek', id)
        await updateDoc(docRef, {title})
        set(state => ({
            menuWeek: state.menuWeek.map(menu => menu.id === id ? {...menu, title} : menu),
            loading: false
        }))
       } catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    },
    deleteMenu: async (userId, id) => {
        set({ loading: true, error: null})
       try {
        const docRef = doc(db, 'users', userId, 'menuWeek', id)
        await deleteDoc(docRef)
        set(state => ({
            menuWeek: state.menuWeek.filter(menu => menu.id !== id),
            loading: false
        }))
       } catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    },
    deleteIncludeMenuItem: async (userId, idMenuWeek, idDeleteRecipeItem) => {
        
        set(state => ({
            menuWeek: state.menuWeek.map(menuItem => {
            if(menuItem.id === idMenuWeek) {
                return {
                    ...menuItem, 
                    includesRecipe: menuItem.includesRecipe.filter(item => item.id !== idDeleteRecipeItem)
                }}
            return menuItem}
            )
        }))
    }

}))