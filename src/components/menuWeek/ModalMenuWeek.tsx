import { useState, type FC } from "react"
import { useMenuWeek } from "../../store/storeMenuWeek";
import { useRecipesStore } from "../../store/store";


interface ModalMenuWeekProps {
    show: boolean;
    setShow: (arg: boolean) => void;
}

export const ModalMenuWeek: FC<ModalMenuWeekProps> = ({ show, setShow }) => {
    const [title, setTitle] = useState('')
    const { recipesList } = useRecipesStore()
    const { menuWeek, updateIncludesRecipe } = useMenuWeek()

   

    return (
        <>
            
                <div className={`modalMenuWeek ${show ? 'active' : ''}`}>
                    <button onClick={() => setShow(false)} className="btn btnClose">x</button>

                    <input 
                        type="text" 
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <div>
                        {recipesList?.filter(item => 
                            item.title.toLowerCase() !== title).map(recipeItem => 
                                <button onClick={() => updateIncludesRecipe(item ,recipeItem.id)}>{recipeItem.title}</button>)}
                    </div>
                    
                </div>
                <div onClick={() => setShow(false)} className={`modalMenuWeekBack ${show ? 'active' : ''}`}></div>

        </>
    )
}