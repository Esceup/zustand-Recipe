import { create } from 'zustand';
import {
   type User,
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signOut,
   updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { FirebaseError } from 'firebase/app';
interface AuthState {
   user: User | null;
   loading: boolean;
   isRegister: boolean;
   setIsRegister: (isRegister: boolean) => void;
   error: string | null;
   setError: (error: string | null) => void;
   setUser: (user: User | null) => void;
   setLoading: (loading: boolean) => void;
   login: (email: string, password: string) => Promise<void>;
   register: (email: string, password: string, displayName?: string) => Promise<void>;
   logout: () => Promise<void>;
   updateUserDisplayName: (newDisplayName: string) => Promise<void>;
}

const firebaseErrorMessage: Record<string, string> = {
   'auth/email-already-in-use': 'Пользователь с таким email уже существует',
   'auth/invalid-email': 'Некорректный формат email',
   'auth/weak-password': 'Пароль слишком слабый (минимум 6 символов)',
   'auth/user-not-found': 'Пользователь с таким email не найден',
   'auth/wrong-password': 'Неверный пароль',
   'auth/invalid-credential': 'Неверный email или пароль',
   'auth/too-many-requests': 'Слишком много неудачных попыток. Попробуйте позже',
   'auth/network-request-failed': 'Ошибка сети. Проверьте подключение',
};

const getRussianErrorMessage = (error: unknown): string => {
   if (error instanceof FirebaseError) {
      return firebaseErrorMessage[error.code] ?? `Ошибка: ${error.code}`;
   }
   return 'Неизвестная ошибка';
};

export const useAuthStore = create<AuthState>((set) => {
   const checkValidError = (err: unknown) => {
      const message = getRussianErrorMessage(err);
      set({ error: message, loading: false });
      throw err;
   };

   return {
      user: null,
      loading: true,
      isRegister: false,
      setIsRegister: (isRegister) => set({ isRegister }),
      error: null,
      setError: (error) => set({ error }),
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),

      login: async (email, password) => {
         set({ loading: true, error: null });
         try {
            await signInWithEmailAndPassword(auth, email, password);
         } catch (error: unknown) {
            checkValidError(error);
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
            checkValidError(error);
         }
      },

      logout: async () => {
         set({ loading: true, error: null });
         try {
            await signOut(auth);
         } catch (error: unknown) {
            checkValidError(error);
         }
      },

      updateUserDisplayName: async (newDisplayName: string) => {
         const currentUser = auth.currentUser;
         if (!currentUser) throw new Error('Нет авторизованного пользователя');

         set({ loading: true, error: null });

         try {
            await updateProfile(currentUser, { displayName: newDisplayName });
            set({ user: { ...currentUser, displayName: newDisplayName }, loading: false });
         } catch (error: unknown) {
            checkValidError(error);
         }
      },
   };
});
