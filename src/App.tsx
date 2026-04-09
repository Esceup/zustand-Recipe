import './App.css'
import { LoginForm } from './components/auth/LoginForm';
import { RecipeList } from './components/recipeListPage/RecipeList'
import { useAuthStore } from './store/storeAuth'
import { useEffect } from 'react';


function App() {

  const { user, loading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
    console.log(1)
  }, [])

  if(loading) return <div className='loader'></div>;

 

  return (
    <>     
      {user ? <RecipeList/> : <LoginForm />  }
    </>
  )
}

export default App
