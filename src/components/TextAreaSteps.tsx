import { useState, type FC } from "react";
import { useRecipesStore } from "../store/store"

interface StepsProps {
    modalMode: string;
}

export const TextAreaSteps:FC<StepsProps> = ({ modalMode }) => {

    const [title, setTitle] = useState('')
    const { recipesList } = useRecipesStore()


    return (
       <>
        <h3>Пошаговый рецепт</h3>
        <ul>
           {modalMode === 'edit' 
            ?   
                recipesList.map(item => 
                    item.steps.map(step => 
                        <li>
                            <textarea name={step.title} id={step.id}>{step.title}</textarea>
                        </li>
                    )
                )
                
            :  
                 <li>
                    <textarea
                        onChange={(event) => setTitle(event.target.value)}
                        >{title}</textarea>
                </li>
            
           
           }
        </ul>
       </>  
    )
}