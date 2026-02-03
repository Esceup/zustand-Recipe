import { useState, type FC, type FormEvent} from "react"
import type { IIngredient } from "../types/types";
import { storeIngredients } from "../store/storeIngredients";
import { generatedId } from "../function/generatedId";


interface InputIngredients {
    ingredients: IIngredient[];
    setIngredients: (ingredients: IIngredient[]) => void;
}




export const InputIngredients:FC<InputIngredients> = ({ ingredients, setIngredients}) => {

    // const { Ingredients, addNewIngredient, searchIngredient} = storeIngredients()
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [unitTitle, setUnitTitle] = useState('')
    const { Ingredients } = storeIngredients()


    const updateValue = (id: string, field: keyof IIngredient, value: string) => {
        setIngredients(ingredients.map((item) => 
            item.id === id ? {...item, [field]: value } : item
        ))

    }

    const deleteIngredient = (id: string) => {
        setIngredients(ingredients.filter(item => item.id !== id))
    }

    const addIngredient = (event: FormEvent) => {
        const newIngredients: IIngredient = {
            id: generatedId(),
            title: title.trim(),
            unit: unitTitle.trim()
        }

        setIngredients([...ingredients, newIngredients])
        setTitle('')
        setUnitTitle('')

        event.stopPropagation()
    }
    
   



    return (
        <>
            <ul className="listReset ingredientsList">
                {ingredients?.map((item) => (
                <li key={item.id} className="ingredientsItem">

                    <input 
                        className="inputModal first" 
                        type="text" 
                        value={item.title}
                        onChange={(event) => updateValue(item.id, 'title', event.target.value)}
                    />
                    <span className="spanUnit">ед. изм.</span>
                    <input 
                        className="inputModal" 
                        type="text" 
                        value={item.unit}
                        onChange={(event) => updateValue(item.id, 'unit', event.target.value)}
                    />
                    <button className="btndelete" onClick={() => deleteIngredient(item.id)}>x</button>
                </li>
            ))}
            </ul>
            
                <div className="ingredientsItem">
                    <div>
                        <input 
                                type="text" 
                                className="inputModal first"
                                placeholder="Введите ингредиент"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                            
                            />
                            <span className="popularIngredientsToggle">?</span>
                            <ul className={`popularIngredientsList ${show ? 'active': ''}`}>
                                {Ingredients?.map((item) => 
                                    <li key={item.id}>{item.title}</li>
                                )}
                            </ul>
                    </div>
            
            <span className="spanUnit">ед. изм.</span>
            <input 
                type="text" 
                className="inputModal"
                placeholder="Введите ед. изм."
                value={unitTitle}
                onChange={(event) => setUnitTitle(event.target.value)}
            />
            <button className="btn btnadd" onClick={addIngredient}>+</button>
                </div>
            
            
        </>
    )
}