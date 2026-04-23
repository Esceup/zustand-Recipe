import './App.css';
import { LoginForm } from './components/auth/LoginForm';
import { MainPage } from './components/MainPage';
import { useAuthStore } from './store/storeAuth';

function App() {
  const { user, loading } = useAuthStore();

  if (loading) return <div className="loader"></div>;

  return <>{user ? <MainPage /> : <LoginForm />}</>;
}

export default App;
