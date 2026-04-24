import { create } from 'zustand';
import type { IMenuWeek } from '../types/types';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface MenuWeekStore {
   loading: boolean;
   error: string | null;
   menuWeek: IMenuWeek[];
   editingTitle: string;
   editingMenuId: string | null;
   setEditingMenuId: (id: string | null, title?: string) => void;
   fetchMenuWeek: (userId: string) => Promise<void>;
   addNewMenu: (userId: string, title: string) => Promise<void>;
   addExistedRecipe: (
      userId: string,
      id: string,
      idRecipe: string,
      titleRecipe: string
   ) => Promise<void>;
   editTitleMenu: (userId: string, id: string, title: string) => Promise<void>;
   deleteMenu: (userId: string, id: string) => Promise<void>;
   deleteExistedMenuItem: (
      userId: string,
      idMenuWeek: string,
      idDeleteRecipeItem: string
   ) => Promise<void>;
}

export const useMenuWeekStore = create<MenuWeekStore>((set, get) => ({
   loading: false,
   error: null,
   menuWeek: [],
   editingTitle: '',
   editingMenuId: null,
   setEditingMenuId: (id, title = '') => set({ editingMenuId: id, editingTitle: title }),
   fetchMenuWeek: async (userId) => {
      set({ loading: true, error: null });
      try {
         const colRef = collection(db, 'users', userId, 'menuWeek');
         const snapshot = await getDocs(colRef);
         const items = snapshot.docs.map((menu) => ({
            id: menu.id,
            ...menu.data(),
         })) as IMenuWeek[];
         if (items.length === 0) {
            set({ loading: false });
         } else {
            set({ menuWeek: items, loading: false });
         }
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },

   addNewMenu: async (userId, title) => {
      set({ loading: true, error: null });

      try {
         const colRef = collection(db, 'users', userId, 'menuWeek');
         const docRef = await addDoc(colRef, { title, includesRecipe: [] });
         const newMenu: IMenuWeek = { id: docRef.id, title, recipesForWeek: [] };
         set((state) => ({ menuWeek: [...state.menuWeek, newMenu], loading: false }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },

   addExistedRecipe: async (userId, idMenuWeekItem, idRecipe, titleRecipe) => {
      set({ loading: true, error: null });
      try {
         const menuItem = get().menuWeek.find((item) => item.id === idMenuWeekItem);

         if (!menuItem) throw new Error('Меню не найдено');
         if (menuItem?.recipesForWeek.some((recipe) => recipe.id === idRecipe)) {
            set({ loading: false });
            alert('Уже есть в вашем меню');
            return;
         }

         const newRecipeForMenu = [
            ...menuItem.recipesForWeek,
            { id: idRecipe, title: titleRecipe },
         ];

         const docRef = doc(db, 'users', userId, 'menuWeek', idMenuWeekItem);
         await updateDoc(docRef, { recipesForWeek: newRecipeForMenu });

         set((state) => ({
            menuWeek: state.menuWeek.map((menuItem) =>
               menuItem.id === idMenuWeekItem
                  ? { ...menuItem, recipesForWeek: newRecipeForMenu }
                  : menuItem
            ),
            loading: false,
         }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         } else {
            set({ loading: false, error: 'Ошибка' });
            alert('Ошибка добавления меню');
         }
      }
   },

   editTitleMenu: async (userId, id, title) => {
      set({ loading: true, error: null });
      try {
         const docRef = doc(db, 'users', userId, 'menuWeek', id);
         await updateDoc(docRef, { title });
         set((state) => ({
            menuWeek: state.menuWeek.map((menu) => (menu.id === id ? { ...menu, title } : menu)),
            loading: false,
         }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },

   deleteMenu: async (userId, id) => {
      set({ loading: true, error: null });
      try {
         const docRef = doc(db, 'users', userId, 'menuWeek', id);
         await deleteDoc(docRef);
         set((state) => ({
            menuWeek: state.menuWeek.filter((menu) => menu.id !== id),
            loading: false,
         }));
      } catch (err: unknown) {
         if (err instanceof FirebaseError) {
            set({ loading: false, error: err.message });
            alert(err);
         }
      }
   },

   deleteExistedMenuItem: async (userId, idMenuWeek, idDeleteRecipeItem) => {
      set({ loading: true, error: null });
      try {
         const menuItem = get().menuWeek.find((menu) => menu.id === idMenuWeek);
         if (!menuItem) throw new Error('Меню не найдено');

         const newRecipeForMenu = menuItem.recipesForWeek.filter(
            (recipe) => recipe.id !== idDeleteRecipeItem
         );
         const docRef = doc(db, 'users', userId, 'menuWeek', idMenuWeek);
         await updateDoc(docRef, { recipesForWeek: newRecipeForMenu });

         set((state) => ({
            menuWeek: state.menuWeek.map((menu) =>
               menu.id === idMenuWeek ? { ...menu, recipesForWeek: newRecipeForMenu } : menu
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
}));
