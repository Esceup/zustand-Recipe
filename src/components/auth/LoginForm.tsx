import React, { useCallback, useState } from 'react';
import { useAuthStore } from '../../store/storeAuth';

export const LoginForm = () => {
   const [title, setTitle] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { register, login, error, setError, isRegister, setIsRegister } = useAuthStore();
   const [lengthValue, setLengthValue] = useState(true);

   const toggleMode = useCallback(() => {
      setIsRegister(!useAuthStore.getState().isRegister);
      setError(null);
      setTitle('');
      setEmail('');
      setPassword('');
   }, [setIsRegister, setError]);

   const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      const lengthValue = e.target.value.length;
      setLengthValue(lengthValue > 6);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmerEmail = email.trim();
      const trimmerPassword = password.trim();

      if (isRegister) {
         await register(trimmerEmail, trimmerPassword, title);
         setIsRegister(!useAuthStore.getState().isRegister);
      } else {
         await login(trimmerEmail, trimmerPassword);
      }
   };

   return (
      <div className="LoginForm">
         <h2>{isRegister ? 'Регистрация' : 'Авторизация'}</h2>
         <form onSubmit={handleSubmit}>
            {isRegister ? (
               <div className="blockForLabel">
                  <input
                     id="name"
                     type="text"
                     placeholder=" "
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="inputEmail input-reset"
                     maxLength={30}
                  />
                  <label htmlFor="name" className="labelEmail">
                     Имя*
                  </label>
               </div>
            ) : (
               ''
            )}
            <div className="blockForLabel">
               <input
                  id="email"
                  type="email"
                  placeholder=" "
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inputEmail input-reset"
                  required
               />
               <label htmlFor="email" className="labelEmail">
                  Email*
               </label>
            </div>
            <div className="blockForLabel">
               <input
                  id="password"
                  type="password"
                  placeholder=" "
                  autoComplete="current-password"
                  value={password}
                  onChange={handleChangeInput}
                  className={`inputPass input-reset ${lengthValue ? '' : 'error'}`}
                  minLength={6}
                  required
               />
               <label htmlFor="password" className="labelPass ">
                  Пароль*
               </label>
            </div>
            {error && (
               <div className="errorLogin" role="alert" aria-live="assertive">
                  {error}
               </div>
            )}

            <div>
               <button className="btn btnRegister btn-gradient" type="submit">
                  {isRegister ? 'Создать аккаунт ' : 'Вход'}
               </button>
            </div>

            <button
               onClick={() => {
                  toggleMode();
               }}
               type="button"
               className="btn btnFlipRegister"
            >
               {isRegister ? 'Войти' : 'Регистрация'}
            </button>
         </form>
      </div>
   );
};
