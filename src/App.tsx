import './App.css'
import { LoginForm } from './components/auth/LoginForm';
import { RecipeList } from './components/recipeListPage/RecipeList'
import { useAuthStore } from './store/storeAuth'


function App() {

  const { user, loading } = useAuthStore()

  if(loading) return <div className='loader'></div>;

  return (
    <>     
      {user ? <RecipeList/> : <LoginForm />  }
    </>
  )
}

export default App
