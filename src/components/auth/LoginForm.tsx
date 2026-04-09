import React, { useState } from "react"
import { useAuthStore } from "../../store/storeAuth"

const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Некорректный формат email.';
    case 'auth/weak-password':
      return 'Пароль должен содержать минимум 6 символов.';
    case 'auth/email-already-in-use':
      return 'Пользователь с таким email уже существует.';
    case 'auth/user-not-found':
      return 'Пользователь не найден.';
    case 'auth/wrong-password':
      return 'Неверный пароль.';
    case 'auth/invalid-credential':
        return 'Неверный логин или пароль'  
    default:
      return 'Произошла ошибка. Попробуйте снова.';
  }
};

export const LoginForm = () => {

    const [isRegister, setIsRegister] = useState(true)
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register, login } = useAuthStore()

   

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const trimmerEmail = email.trim()
        const trimmerPassword = password.trim()

        try {
           if(isRegister) {
             await register(trimmerEmail, trimmerPassword, title)
           } else {
            await login(trimmerEmail, trimmerPassword)
           }
        } catch(err) {         
            console.error('Ошибка', err?.code)
            const errCode = err?.code || unknown 
            alert(getErrorMessage(errCode))
        }
    }

    return (
        <div className="LoginForm">
            <h2>{isRegister ? 'Регистрация' : 'Авторизация'}</h2>
            <form onSubmit={handleSubmit}>
                 {isRegister ? <div className="blockForLabel">
                    
                    <input 
                        type="text" 
                        placeholder=""
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="inputEmail input-reset"
                        required
                    />
                    <label className="labelEmail">Имя*</label>
                </div> : ''}
                <div className="blockForLabel">
                    
                    <input 
                        type="email" 
                        placeholder=""
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputEmail input-reset"
                        required
                    />
                    <label className="labelEmail">Email*</label>
                </div>
                 <div className="blockForLabel">
                    
                    <input 
                        type="password" 
                        placeholder=""
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="inputPass input-reset"
                        required
                    />
                    <label className="labelPass ">Пароль*</label>
                 </div>
                
                <div>
                    <button className="btn btnRegister btn-gradient" type="submit">{isRegister ? "Создать аккаунт " : "Вход"}</button> 
                </div>              
            </form>
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="btn btnFlipRegister btn-gradient-blue">                  
                {isRegister ? "Войти" : "Регистрация"}
            </button>
        </div>
    )
}