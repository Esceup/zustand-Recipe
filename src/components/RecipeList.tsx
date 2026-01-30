
import RecipeItem from "./RecipeItem"
// import { Button } from "./Button"
import { useRecipesStore } from "../store/store"

import { ModalCreateRecipe } from "./ModalCreateRecipe"
import { storeModal } from "../store/storeModal"



export function RecipeList() {
  
    const recipesList = useRecipesStore(state => state.recipesList)
    const { openCreateModal } = storeModal()

    return (
        <>

            <h1>Список рецептов</h1>
            <button onClick={openCreateModal}>Добавить рецепт</button>
            <ul className="recipeList">
                {recipesList?.map((recipe) => (
                    <RecipeItem key={recipe.id} recipe={recipe}/>
                ))}
            </ul>
            <ModalCreateRecipe />     
        </>
    )
}