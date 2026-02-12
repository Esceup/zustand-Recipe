import { useState } from "react"

import { useRecipesStore } from "../../store/store"
import { useMenuWeek } from "../../store/storeMenuWeek"
import { ModalMenuWeek } from "./ModalMenuWeek"
import RecipeItem from "../RecipeItem"


export const MenuInWeek = () => {
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [titleSearch, setTitleSearch] = useState('')
    const { menuWeek, addNewMenu } = useMenuWeek()
    const { recipesList } = useRecipesStore()

    const handleNewMenu = () => {

    }

     const handleAddRecipe = () => {
        
    }

    return (

        <>
            <h2>Меню на неделю</h2>           
            <div>
                <label htmlFor="">Добавить меню</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
                <button onClick={() => addNewMenu(title)}>+</button>
            </div>
            <div>
                <label htmlFor="">Поиск</label>
                <input 
                    type="text" 
                    value={titleSearch}
                    onChange={(event) => setTitleSearch(event.target.value)}
                />
            </div>
           
           
            {/* <ul>{recipesList?.map((recipe) => <li key={recipe.id}>{recipe.title}</li>)}</ul> */}
            <ul>
                {menuWeek?.filter(item => item.title.toLowerCase().includes(titleSearch.toLowerCase())).map((item) => 
                    <li key={item.id} onClick={() => setShow(true)}>
                        <h3>{item.title}</h3>
                        <ul className="recipeList">{item.includesRecipe?.map(includeItem => 
                                recipesList?.map(recipeItem => 
                                    recipeItem.id == includeItem ? <RecipeItem key={recipeItem.id} recipe={recipeItem}/>
                                      : '')
                                )
                         }
                        <button>+</button>
                        </ul>
                        
                    </li>
            )}

            </ul>
            {/* <ModalMenuWeek show={show} setShow={setShow}/> */}
        </>
    )
}