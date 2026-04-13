import { create } from 'zustand';
import { 
  type User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FirebaseError } from 'firebase/app' 

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;

}

export const useAuthStore = create<AuthState>((set) => {

  onAuthStateChanged(auth, (user) => {
    set({ user, loading: false})
  })

  return {
    user: null,
    loading: true,
    error: null,


    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        await signInWithEmailAndPassword(auth, email, password);    
      } catch (error: unknown) {
        const message = error instanceof FirebaseError ? error.message : 'Неизвестная ошибка';
        
        set({ error: message, loading: false });
        throw error; 
      }
    },

    register: async (email, password, displayName) => {
      set({ loading: true, error: null });
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
        
      } catch (error: unknown) {
       const message = error instanceof FirebaseError ? error.message : 'Неизвестная ошибка';
        
       set({ error: message, loading: false });
       throw error; 
       
      }
    },

    logout: async () => {
      set({ loading: true, error: null });
      try {
        await signOut(auth);
        
      } catch (error: unknown) {
        const message = error instanceof FirebaseError ? error.message : 'Неизвестная ошибка';
        
        set({ error: message, loading: false });
        throw error; 
      }
    },
  }
});