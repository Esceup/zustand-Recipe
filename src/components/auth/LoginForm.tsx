import React, { useState } from "react"
import { useAuthStore } from "../../store/authStore"

export const LoginForm = () => {

    const [isRegister, setIsRegister] = useState(false)
    const [title, setTitle] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register, login } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
           if(isRegister) {
             await register(email, password, title)
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
                        type="text" 
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
                        type="text" 
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