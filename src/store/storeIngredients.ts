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
    addNewIngredient: (userId: string, title: string, value:string ,unit: string) => Promise<void>;
    searchIngredient: (title: string) => IIngredient[];
    deleteIngredient: (userId: string, id: string) => Promise<void>;
}

const DEFAULT_INGREDIENTS: Omit<IIngredient, 'id'>[] = [
    { title: 'Картофель', value: '3', unit: 'шт'},
    { title: 'Лук', value: '3', unit: 'шт'},
    { title: 'Морковь', value: '1', unit: 'шт'},
    { title: 'Помидоры', value: '1', unit: 'шт'},
    { title: 'Курица', value: '500', unit: 'гр'},
    { title: 'Говядина', value: '500', unit: 'гр'},
    { title: 'Свинина', value: '500', unit: 'гр'},
    { title: 'Рис', value: '200', unit: 'гр'},
    { title: 'Соль', value: '1', unit: 'ст.л'},
    { title: 'Перец', value: '1', unit: 'шт'},
    { title: 'Мука', value: '100 ', unit: 'гр'},
    { title: 'Яйца', value: '1 ', unit: 'шт'},
    { title: 'Молоко', value: '70', unit: 'мл'},
    { title: 'Сметана', value: '1 ', unit: 'ст.л'},
]
export const useIngredientsStore = create<IngredientsStore>()((set, get) => ({
    loading: false,
    error: null,
    Ingredients: [],

    fetchIngredient: async (userId) => {
        set({ loading: true, error: null });
        try {
            const colRef = collection(db, 'users', userId, 'ingredients' )
            const snapshot = await getDocs(colRef)
            const items = snapshot.docs.map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    title: data.title ?? '',
                    value: data.value ?? '',
                    unit: data.unit ?? 'кг',

                } as IIngredient
            })

            if(items.length === 0) {
                await Promise.all(DEFAULT_INGREDIENTS.map((ing) => get().addNewIngredient(userId, ing.title, ing.value ,ing.unit)))
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

    addNewIngredient: async (userId, title, value, unit) => {
        set({ loading: true, error: null});
        try {
            const colRef = collection(db, 'users', userId, 'ingredients') 
            const docRef = await addDoc(colRef, { title, value, unit})
            const newItem: IIngredient = { id: docRef.id, title, value, unit }
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