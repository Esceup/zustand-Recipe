import { useEffect } from 'react';
import './App.css';
import { LoginForm } from './components/auth/LoginForm';
import { MainPage } from './components/MainPage';
import { useAuthStore } from './store/storeAuth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useRecipesStore } from './store/storeRecipes';
import { useIngredientsStore } from './store/storeIngredients';
import { useMenuWeekStore } from './store/storeMenuWeek';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const { user, loading } = useAuthStore();

   if (loading) return <div className="loader"></div>;
   if (!user) return <Navigate to="/login" replace />;

   return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
   const { user, loading } = useAuthStore();

   if (loading) return <div className="loader"></div>;
   if (user) return <Navigate to="/" replace />;

   return <>{children}</>;
};

function App() {
   const { setUser, setLoading } = useAuthStore();

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         setUser(firebaseUser);

         if (firebaseUser) {
            await Promise.all([
               useRecipesStore.getState().fetchRecipe(firebaseUser.uid),
               useIngredientsStore.getState().fetchIngredient(firebaseUser.uid),
               useMenuWeekStore.getState().fetchMenuWeek(firebaseUser.uid),
            ]);
         } else {
            useRecipesStore.setState({ recipesList: [], loading: false, error: null });
            useIngredientsStore.setState({ Ingredients: [], loading: false, error: null });
            useMenuWeekStore.setState({ menuWeek: [], loading: false, error: null });
         }

         setLoading(false);
      });

      return () => unsubscribe();
   }, [setUser, setLoading]);

   return (
      <BrowserRouter>
         <Routes>
            <Route
               path="/login"
               element={
                  <PublicRoute>
                     <LoginForm />
                  </PublicRoute>
               }
            />

            <Route
               path="/"
               element={
                  <ProtectedRoute>
                     <MainPage />
                  </ProtectedRoute>
               }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
