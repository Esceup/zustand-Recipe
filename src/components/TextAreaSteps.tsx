import { useState, type FC } from "react";
import type { IStep } from "../types/types";
import { generatedId } from "../function/generatedId";

interface StepsProps {
    modalMode: string;
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
        <ul className="stepsList">
           {modalMode === 'edit' 
            ?  steps?.map(step => 
                    <li>
                        <textarea className="stepEditArea" id={step.id}>{step.title}</textarea>
                        <button className="btn btnSteps" onClick={() => handleRemove(step.id)}>x</button>
                    </li>
                )            
            : steps?.map(step => 
                    <li>
                        <textarea className="stepEditArea" id={step.id}>{step.title}</textarea>
                        <button className="btn btnSteps" onClick={() => handleRemove(step.id)}>x</button>
                    </li>
                )}
                <li>
                    <textarea
                        className="newStepArea"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}>{title}
                    </textarea>
                    <button className="btn btnSteps" onClick={addNewSteps}>+</button>
                </li>
                  
        </ul>
       </>  
    )
}