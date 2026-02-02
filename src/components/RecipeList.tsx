
import RecipeItem from "./RecipeItem"
// import { Button } from "./Button"
import { useRecipesStore } from "../store/store"

import { ModalCreateRecipe } from "./ModalCreateRecipe"
import { storeModal } from "../store/storeModal"
import { useState } from "react"



export function RecipeList() {
    
    const [title, setTitle] = useState('')
    const recipesList = useRecipesStore(state => state.recipesList)
    const { openCreateModal } = storeModal()

    return (
        <>

            <h1>Список рецептов</h1>
            <label className="searchLabel">Поиск рецепта</label>
            <input 
                type="text"
                className="searchInput"
                value={title} 
                onChange={(event) => setTitle(event?.target.value)}
            />
            <button onClick={openCreateModal}>Добавить рецепт</button>
            <ul className="recipeList">
                {recipesList?.filter(item => item.title.toLowerCase().includes(title.toLowerCase())).map((recipe) => (
                    <RecipeItem key={recipe.id} recipe={recipe}/>
                ))}
            </ul>
            <ModalCreateRecipe />     
        </>
    )
}