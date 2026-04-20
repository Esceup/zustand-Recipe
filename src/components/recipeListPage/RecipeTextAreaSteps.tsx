import { useState, type FC } from "react";
import type { IStep } from "../../types/types";
import { generatedId } from "../../function/generatedId";

interface StepsProps {
    modalMode: 'edit' | 'create';
    steps: IStep[];
    setSteps: (steps: IStep[]) => void;
}

export const TextAreaSteps:FC<StepsProps> = ({ modalMode, steps, setSteps}) => {

    const [title, setTitle] = useState('')


    const addNewSteps = () => {
        const newSteps: IStep = {
            id: generatedId(),
            title: title,
        }
        if(!title) return

        setSteps([...steps, newSteps])
        setTitle('')
    }

    

    const handleRemove = (id: string) => {
        setSteps(steps.filter(step => step.id !== id))
    }

    return (
       <>
        <h3>Пошаговый рецепт</h3>
        <h4>1</h4>
        <ul className="stepsList">
           
           {steps?.map(step => 
            <li key={step.id}>
                <textarea className="stepEditArea" id={step.id}>{step.title}</textarea>
                <button className="btn btnSteps" onClick={() => handleRemove(step.id)}><i className="fa-solid fa-xmark"></i></button>
                <button className="btn btnSteps" onClick={() => handleRemove(step.id)}><i className="fa-solid fa-xmark"></i></button>
            </li>
                )}
            {modalMode === 'edit' ?
                <li>
                    <textarea
                        className="newStepArea"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}>{title}
                    </textarea>
                    <button className="btn btnSteps" onClick={addNewSteps}><i className="fa-solid fa-plus"></i></button>
                </li> 
            : ''}
                  
        </ul>
       </>  
    )
}