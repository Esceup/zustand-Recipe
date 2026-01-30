import { create } from "zustand";
import type { IRecipe } from "../types/types";

interface ModalStore {
    isModalOpen: boolean;
    editingRecipe: IRecipe | null;
    modalMode: 'create' | 'edit';      
    openCreateModal: () => void;
    openEditModal: (recipe: IRecipe) => void;
    closeModal: () => void;

}


export const storeModal = create<ModalStore>((set) => ({
    isModalOpen: false,
    editingRecipe: null,
    modalMode: 'create',

    openCreateModal: () => set({
        isModalOpen: true,
        editingRecipe: null,
        modalMode: 'create'
    }),

    openEditModal: (recipe) => set({
        isModalOpen: true,
        editingRecipe: recipe,
        modalMode: 'edit'
    }),

    closeModal: () => set({
        isModalOpen: false,
        editingRecipe: null
    })

}))