import React, { useState } from "react"
import { useAuthStore } from "../../store/authStore"

export const LoginForm = () => {

    const [isRegister, setIsRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register, login } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
           if(isRegister) {
             await register(email, password)
           } else {
            await login(email, password)
           }
        } catch(err) {
            console.error('Ошибка', err)
        }
    }

    return (
        <div className="LoginForm">
            <h2>{isRegister ? 'Регистрация' : "Авторизация"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="blockForLabel">
                    
                    <input 
                        type="text" 
                        placeholder=""
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputEmail"
                        required
                    />
                    <label className="labelEmail">Email</label>
                </div>
                 <div className="blockForLabel">
                    
                    <input 
                        type="text" 
                        placeholder=""
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="inputPass"
                        required
                    />
                    <label className="labelPass">Пароль</label>
                 </div>
                
                <div>
                    <button className="btn btnRegister" type="submit">{isRegister ? "Создать аккаунт " : "Вход"}</button> 
                </div>              
            </form>
            <button 
                onClick={() => setIsRegister(!isRegister)}
                className="btn btnFlipRegister">                  
                {isRegister ? "Войти" : "Регистрация"}
            </button>
        </div>
    )
}