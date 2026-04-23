import { create } from 'zustand';
import type { IRecipe } from '../types/types';
import { db } from '../lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
interface RecipeStore {
   loading: boolean;
   error: string | null;
   recipesList: IRecipe[];
   fetchRecipe: (userId: string) => Promise<void>;
   createRecipe: (userId: string, recipeData: Omit<IRecipe, 'id'>) => Promise<void>;
   updateRecipe: (
      userId: string,
      id: string,
      recipeData: Partial<Omit<IRecipe, 'id'>>
   ) => Promise<void>;
   removeRecipe: (userId: string, id: string) => Promise<void>;
}

export const useRecipesStore = create<RecipeStore>((set) => ({
   loading: false,
   error: null,
   recipesList: [],
   fetchRecipe: async (userId) => {
      set({ loading: true, error: null });

      try {
         const recipeColl = collection(db, 'users', userId, 'recipes');
         const snapshot = await getDocs(recipeColl);
         const recipes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         })) as IRecipe[];

         if (recipes.length === 0) {
            set({ loading: false });
         } else {
            set({ recipesList: recipes, loading: false });
         }
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },
   createRecipe: async (userId, recipeData) => {
      set({ loading: true, error: null });
      try {
         const recipeColl = collection(db, 'users', userId, 'recipes');
         const docRef = await addDoc(recipeColl, recipeData);
         const newRecipe: IRecipe = { id: docRef.id, ...recipeData };
         set((state) => ({
            recipesList: [...state.recipesList, newRecipe],
            loading: false,
         }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },

   updateRecipe: async (userId, id, recipeData) => {
      set({ loading: true, error: null });
      try {
         const docRef = doc(db, 'users', userId, 'recipes', id);
         await updateDoc(docRef, recipeData);
         set((state) => ({
            recipesList: state.recipesList.map((recipe) =>
               recipe.id === id ? { ...recipe, ...recipeData } : recipe
            ),
            loading: false,
         }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },

   removeRecipe: async (userId, id) => {
      const result = confirm('Точно хотите удалить?');
      if (!result) return;
      set({ loading: true, error: null });

      try {
         const docRef = doc(db, 'users', userId, 'recipes', id);
         await deleteDoc(docRef);
         set((state) => ({
            recipesList: state.recipesList.filter((recipe) => recipe.id !== id),
            loading: false,
         }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },
}));
