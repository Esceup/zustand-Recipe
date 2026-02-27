import { useState } from "react"
import { useRecipesStore } from "../../store/store"
import { IngredientsList } from "../ingredientsPage/IngredientsList"
import RecipeItem from "../recipeListPage/RecipeItem"
import { storeModal } from "../../store/storeModal"

export const MenuWeekPage = () => {

    const [title, setTitle] = useState('')
    const recipesList = useRecipesStore(state => state.recipesList)
    const { openCreateModal } = storeModal()

    return (
        <>
                        <h1>Список рецептов</h1>
                    <div className="flexBlock j-center ">
                        <IngredientsList />
                        <button className="btn btnAddRecipeMain" onClick={openCreateModal}>Добавить рецепт</button>
                    </div>
                    <h3 className="searchLabel">Поиск рецепта</h3>
                    <input 
                        type="text"
                        className="searchInput"
                        value={title} 
                        onChange={(event) => setTitle(event?.target.value)}
                    />
                    
                    <ul className="recipeList">
                        {recipesList?.filter(item => item.title.toLowerCase().includes(title.toLowerCase())).map((recipe) => (
                            <RecipeItem key={recipe.id} recipe={recipe}/>
                        ))}
                    </ul>
                    
                    </>
    )
}