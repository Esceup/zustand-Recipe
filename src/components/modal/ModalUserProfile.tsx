import type { FC } from "react";
import { useAuthStore } from "../../store/authStore";

interface UserProfileProps {
    showModal: boolean;
    setShowModal: (arg: boolean) => void;
}

export const ModalUserProfile:FC<UserProfileProps> = ({ showModal, setShowModal }) => {
    const { logout } = useAuthStore()

    return (
        <>
            <div className={`modalUserProfile ${showModal ? 'show' : ''} ` }>
                <button className="btn btn-gradient" onClick={logout}>Выйти из профиля</button>
            </div>
            <div className={`modalUserProfileBack ${showModal ? 'show' : ''} `} onClick={() => setShowModal(!showModal)}></div>
        </>
    )
}