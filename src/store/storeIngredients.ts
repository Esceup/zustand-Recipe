import { create } from "zustand";
import type { IIngredient } from "../types/types";
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FirebaseError } from "firebase/app";
interface IngredientsStore {
    loading: boolean;
    error: string | null;
    Ingredients: IIngredient[];
    fetchIngredient: (userId: string) => Promise<void>;
    addNewIngredient: (userId: string, title: string, unit: string) => Promise<void>;
    searchIngredient: (title: string) => IIngredient[];
    deleteIngredient: (userId: string, id: string) => Promise<void>;
}

const DEFAULT_INGREDIENTS: Omit<IIngredient, 'id'>[] = [
    { title: 'Картофель', unit: '3 шт'},
    { title: 'Лук', unit: '1 шт'},
    { title: 'Морковь', unit: '1 шт'},
    { title: 'Помидоры', unit: '1 шт'},
    { title: 'Курица', unit: '500 гр'},
    { title: 'Говядина', unit: '500 гр'},
    { title: 'Свинина', unit: '500 гр'},
    { title: 'Рис', unit: '200 гр'},
    { title: 'Соль', unit: '1 ст.л'},
    { title: 'Перец', unit: '1 шт'},
    { title: 'Мука', unit: '100 гр'},
    { title: 'Яйца', unit: '1 шт'},
    { title: 'Молоко', unit: '70 мл'},
    { title: 'Сметана', unit: '1 ст.л'},
]
export const useStoreIngredients = create<IngredientsStore>()((set, get) => ({
    loading: false,
    error: null,
    Ingredients: [],

    fetchIngredient: async (userId) => {
        set({ loading: true, error: null });
        try {
            const colRef = collection(db, 'users', userId, 'ingredients' )
            const snapshot = await getDocs(colRef)
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}) ) as IIngredient[]

            if(items.length === 0) {
                await Promise.all(DEFAULT_INGREDIENTS.map((ing) => get().addNewIngredient(userId, ing.title, ing.unit)))
                set({ loading: false})
            } else {
                set({ Ingredients: items, loading: false })
            }
        } catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    },

    addNewIngredient: async (userId, title, unit) => {
        set({ loading: true, error: null});
        try {
            const colRef = collection(db, 'users', userId, 'ingredients') 
            const docRef = await addDoc(colRef, { title, unit})
            const newItem: IIngredient = { id: docRef.id, title, unit }
            set(state => ({ Ingredients: [...state.Ingredients, newItem], loading: false}))
        }  catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    },

    searchIngredient: (title) => {
        const lowerTitle = title.toLowerCase()
        return get().Ingredients.filter(item => item.title.toLowerCase().includes(lowerTitle))
    },

    deleteIngredient: async (userId, id) => {
        set({ loading: true, error: null});
        try {           
            const docRef = doc(db, 'users', userId, 'ingredients', id)
            await deleteDoc(docRef)
            set(state => ({
                Ingredients: state.Ingredients.filter(ing => ing.id !== id), loading: false
            }))
        } catch(err: unknown) {
            if(err instanceof FirebaseError) {
                set({ loading: false, error: err.message})
                alert(err)
            }
        }
    }
})
)