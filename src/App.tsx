import './App.css'
import { LoginForm } from './components/auth/LoginForm';
import { RecipeList } from './components/recipeListPage/RecipeList'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react';


function App() {

  const { user, loading, checkAuth, logout } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [logout])

  if(loading) return <div className='loader'></div>;

 

  return (
    <>
      {user ? <RecipeList/> : <LoginForm />  }
    </>
  )
}

export default App
