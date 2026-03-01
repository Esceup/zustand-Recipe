import { useState } from "react"
import { useRecipesStore } from "../../store/store"
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
                        
                        <button className="btn btnAddRecipeMain btn-gradient" onClick={openCreateModal}>Добавить рецепт</button>
                    </div>
                    <div >
                        <h3 className="searchLabel">Поиск</h3>
                        <div className="flexBlockInputAdd">
                            <input 
                            type="text"
                            className="searchInput"
                            value={title} 
                            onChange={(event) => setTitle(event?.target.value)}
                            
                        />
                        <i className="searchInputAbsolute fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                    
                    <ul className="recipeList">
                        {recipesList?.filter(item => item.title.toLowerCase().includes(title.toLowerCase())).map((recipe) => (
                            <RecipeItem key={recipe.id} recipe={recipe}/>
                        ))}
                    </ul>
                    
                    </>
    )
}