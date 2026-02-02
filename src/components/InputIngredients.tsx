import { useState, type FC, type FormEvent } from "react"
import type { IIngredient } from "../types/types";
import { generatedId } from "../function/generatedId";

interface InputIngredients {
    ingredients: IIngredient[];
    setIngredients: (ingredients: IIngredient[]) => void;
}




export const InputIngredients:FC<InputIngredients> = ({ ingredients, setIngredients}) => {

    // const { Ingredients, addNewIngredient, searchIngredient} = storeIngredients()
    const [title, setTitle] = useState('')
    const [unitTitle, setUnitTitle] = useState('')


   const addNewIngredient = (event: FormEvent) => {

    event.preventDefault()

    const newIngredient: IIngredient = {
        id: generatedId(),
        title: title,
        unit: unitTitle
    }

    setIngredients([...ingredients, newIngredient])

    setTitle('')
    setUnitTitle('')
   }



    return (
        <>
            <input 
                type="text" 
                className="inputModal first"
                placeholder="Введите ингредиент"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            
            />
            <input 
                type="text" 
                className="inputModal"
                placeholder="Введите ед. изм."
                value={unitTitle}
                onChange={(event) => setUnitTitle(event.target.value)}
            />
            {/* <button onClick={addNewIngredient}>Добавить продукт</button> */}
        </>
    )
}