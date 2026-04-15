import React, { useState } from "react"
import { useAuthStore } from "../../store/storeAuth"
import { FirebaseError } from "firebase/app"

const getRussianErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Пользователь с таким email уже существует';
    case 'auth/invalid-email':
      return 'Некорректный формат email';
    case 'auth/weak-password':
      return 'Пароль слишком слабый (минимум 6 символов)';
    case 'auth/user-not-found':
      return 'Пользователь с таким email не найден';
    case 'auth/wrong-password':
      return 'Неверный пароль';
    case 'auth/invalid-credential':
      return 'Неверный email или пароль'; 
    case 'auth/too-many-requests':
      return 'Слишком много неудачных попыток. Попробуйте позже';
    case 'auth/network-request-failed':
      return 'Ошибка сети. Проверьте подключение';
    default:
      return `Ошибка: ${errorCode}`;
  }
};



export const LoginForm = () => {

    const [isRegister, setIsRegister] = useState(true)
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register, login } = useAuthStore()
    const [lengthValue, setLengthValue] = useState(true)

   const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      const lengthValue = e.target.value.length
      setLengthValue(lengthValue > 6) 
  }

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
        } catch(error: unknown) {         
            if(error instanceof FirebaseError) {
                const russianMessage = getRussianErrorMessage(error.code)
                console.error(russianMessage)
                alert(russianMessage)
            } else {
                alert('Некорректные данные')
            }
            
        }
    }

    return (
        <div className="LoginForm">
            <h2>{isRegister ? 'Регистрация' : 'Авторизация1'}</h2>
            <form onSubmit={handleSubmit}>
                 {isRegister ? <div className="blockForLabel">
                    
                    <input 
                        id="name"
                        type="text" 
                        placeholder=" "
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="inputEmail input-reset"
                        maxLength={30}
                    />
                    <label htmlFor="name" className="labelEmail">Имя*</label>
                </div> : ''}
                <div className="blockForLabel">
                    
                    <input 
                        id="email"
                        type="email" 
                        placeholder=" "
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputEmail input-reset"
                        required
                    />
                    <label htmlFor="email" className="labelEmail">Email*</label>
                </div>
                 <div className="blockForLabel">
                    
                    <input 
                        id="password"
                        type="password" 
                        placeholder=" "
                        value={password} 
                        onChange={handleChangeInput}
                        className={`inputPass input-reset ${lengthValue ? '' : 'error'}`}
                        minLength={6}
                        required
                    />
                    <label htmlFor="password" className="labelPass ">Пароль*</label>
                 </div>
                
                <div>
                    <button className="btn btnRegister btn-gradient" type="submit">{isRegister ? "Создать аккаунт " : "Вход"}</button> 
                </div> 

                  <button 
                    onClick={() => setIsRegister(!isRegister)}
                    className="btn btnFlipRegister">                  
                    {isRegister ? "Войти" : "Регистрация"}
                </button>
                        
            </form>
          
        </div>
    )
}