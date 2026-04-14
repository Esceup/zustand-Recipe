import { useState, useRef, type FC } from "react";
import { useAuthStore } from "../../store/storeAuth";

interface UserProfileProps {
    showModal: boolean;
    setShowModal: (arg: boolean) => void;
}

export const ModalUserProfile:FC<UserProfileProps> = ({ showModal, setShowModal }) => {
    const { logout, user, updateUserDisplayName } = useAuthStore()
    const [title, setTitle] = useState('')
    const [editTitle, setEditTitle] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleEditTitle = () => {
        setEditTitle(true)
        setTitle(user?.displayName ?? '')

        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
        
    }

    const handleSaveTitle = async () => {
        if(title.trim()) {
            try {
                await updateUserDisplayName(title)
                
            } catch(error: unknown) {
                console.error(error)
            }
        }
        setEditTitle(false)
    }

    return (
        <>
            <div className={`modalUserProfile ${showModal ? 'show' : ''} ` }>
                <div className="d-flex j-center">
                    <h3 className={`${editTitle ? 'd-none' : 'd-block'}`}>{user?.displayName || 'Имя не указано'}</h3>
                    <input className={`searchEditTitle ${editTitle ? 'd-inline' : 'd-none'}`} ref={inputRef} type="text" value={title ?? ''} onChange={(e) => setTitle(e.target.value)}/> 
                    <button className={`btn-reset white ${editTitle ? 'd-none' : 'd-inline'}`} onClick={handleEditTitle}><i className="fa-solid fa-pencil "></i></button>
                    <button className={`btn-reset white ${editTitle ? 'd-inline' : 'd-none'}`} onClick={handleSaveTitle}><i className="fa-solid fa-check  "></i></button>                
                </div>
                
                <h3>{user?.email}</h3>
                <button className="btn btn-gradient p-btn-normal" onClick={logout}>Выйти из профиля</button>              
            </div>
            
            <div className={`modalUserProfileBack ${showModal ? 'show' : ''} `} onClick={() => setShowModal(!showModal)}></div>
        </>
    )
}