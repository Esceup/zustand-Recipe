import './App.css'
import { LoginForm } from './components/auth/LoginForm';
import { TabsBlock } from './components/recipeListPage/TabsBlock'
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
      
      {user ? <TabsBlock/> : <LoginForm />  }
    </>
  )
}

export default App
