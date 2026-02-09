import { useState, type FC } from "react"
import { useMenuWeek } from "../../store/storeMenuWeek";


interface ModalMenuWeekProps {
    show: boolean;
    setShow: () => void;
}

export const ModalMenuWeek: FC<ModalMenuWeekProps> = ({ show, setShow }) => {
    const [title, setTitle] = useState('')
    const { addNewMenu } = useMenuWeek()


    return (
        <>
            <div  onClick={() => setShow()} className={`modalMenuWeekBack ${show ? 'active' : ''}`}>
                <div className="modalMenuWeek">
                    <button onClick={() => setShow()}>x</button>

                    <input 
                        type="text" 
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <button onClick={() => addNewMenu(title)}>+</button>
                </div>
            </div>

        </>
    )
}