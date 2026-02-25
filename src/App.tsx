import './App.css'
import { LoginForm } from './components/auth/LoginForm';
import { RecipeList } from './components/menuList/RecipeList'
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
    <div className={user ? 'headerBlock' : 'headerBlock loginForm'}>
      
      <img className='logoMain' src="/src/assets/main-logo.png" alt="menu" />
    </div>
      {user ? <RecipeList/> : <LoginForm />  }
    </>
  )
}

export default App
