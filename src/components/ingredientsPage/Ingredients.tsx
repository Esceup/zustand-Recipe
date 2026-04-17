import { useState } from "react"
import { useStoreIngredients } from "../../store/storeIngredients"
import { useAuthStore } from "../../store/storeAuth"



export const Ingredients = () => {

    const { Ingredients, addNewIngredient, deleteIngredient, loading} = useStoreIngredients()
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [searchTitle, setSearchTitle] = useState('')
    const [unit, setUnit] = useState('')
    const [error, setError] = useState(false)

    const userId = useAuthStore(state => state.user?.uid)
    if(userId === undefined) return
    
    const handleNewIngredient = () => {        
        if(title === '')  {
            setError(true)
            return false
        }

        
        setError(title ? false : true)
        addNewIngredient(userId, title, unit)
        setTitle('')
        setUnit('')
        
    }


    return (
          <>
            <div className={`loaderFullBack ${loading ? 'loading' : ''}`}>
                <div className='loader'></div>
            </div>
            <h2>Ингредиенты</h2>
            {/* <img src="src\assets\11.jpg" alt="" />   */}
            <div className={`popularIngredientsListBlock ${show ? 'active' : ''}`}>
            <div className="flexBlock mt-15px">
                <input 
                    type="text" 
                    className={`inputModal first  mb-5px input-reset ${error ? 'error' : ''} `}
                    value={title}
                    placeholder="Наименование ингредиента"
                    onChange={(event) => setTitle(event.target.value)}
                />
                <input 
                    type="text" 
                    className="inputModal mb-5px mr-15px input-reset"
                    value={unit}
                    placeholder="кол-во и ед. измерения"
                    onChange={(event) => setUnit(event.target.value)}
                />
                <button className="btn btnAddNewIngredient btn-gradient" onClick={handleNewIngredient}>Добавить</button>
                </div>
                
                <input 
                    type="text" 
                    className={`inputModal first mb-15px input-reset ${error ? 'error' : ''} `}
                    value={searchTitle}
                    placeholder="Поиск"
                    onChange={(event) => setSearchTitle(event.target.value)}
                />
            <ul className={`listReset popularIngredientsListMain`}>
                {Ingredients?.filter(filterItem => 
                    filterItem.title.toLowerCase().includes(searchTitle.toLowerCase())).sort((a, b) => a.title.localeCompare(b.title)).map((item) => 
                    <li className="popularIngredientItem" key={item.id}>{item.title} 
                        <span 
                            onClick={() => deleteIngredient(userId, item.id)} 
                            className="deleteIngredient">
                            <i className="fa-solid fa-trash-can"></i> 
                        </span>
                    </li>
                )}
            </ul>
            
           </div>
           <div onClick={() => setShow(false)} className={`backModal ${show ? 'active' : ''}`}></div>
          </>
    )
}