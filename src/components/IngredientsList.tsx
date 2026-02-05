import { useState } from "react"
import { storeIngredients } from "../store/storeIngredients"



export const IngredientsList = () => {

    const { Ingredients, addNewIngredient, deleteIngredient} = storeIngredients()
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [unit, setUnit] = useState('')
    const [error, setError] = useState(false)

    const handleNewIngredient = () => {        
        if(title === '')  {
            setError(true)
            return false
        }
        setError(title ? false : true)
        addNewIngredient(title, unit)
        setTitle('')
        setUnit('')
        
    }


    return (
          <>
          <button className="btn btnIngredientMain" onClick={() => setShow(show ? false : true)}>Ингредиенты</button>
            <div className={`popularIngredientsListBlock ${show ? 'active' : ''}`}>
            
            <ul className={`listReset popularIngredientsListMain`}>
                {Ingredients?.sort((a, b) => a.title.localeCompare(b.title)).map((item) => 
                    <li className="popularIngredientItem" key={item.id}>{item.title} <span onClick={() => deleteIngredient(item.id)} className="deleteIngredient">х</span></li>
                )}
            </ul>
            <div className="flexBlock mt-15px">
                <input 
                    type="text" 
                    className={`inputModal first mb-5px ${error ? 'error' : ''} `}
                    value={title}
                    placeholder="Наименование ингредиента"
                    onChange={(event) => setTitle(event.target.value)}
                />
                <input 
                    type="text" 
                    className="inputModal mb-5px mr-15px"
                    value={unit}
                    placeholder="кол-во и ед. измерения"
                    onChange={(event) => setUnit(event.target.value)}
                />
                <button className="btn btnAddNewIngredient" onClick={handleNewIngredient}>+</button>
                </div>
           </div>
           <div onClick={() => setShow(false)} className={`backModal ${show ? 'active' : ''}`}></div>
          </>
    )
}