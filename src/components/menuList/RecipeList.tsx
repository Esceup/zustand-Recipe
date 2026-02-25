
import { useRecipesStore } from "../../store/store"
import { ModalCreateOrUpdateRecipe } from "../modal/ModalCreateOrUpdateRecipe"
import { storeModal } from "../../store/storeModal"
import { useState } from "react"
import { IngredientsList } from "../ingredients/IngredientsList"
import { MenuInWeek } from "../menuWeek/MenuInWeek"
import RecipeItem from "./RecipeItem"
import { useAuthStore } from "../../store/authStore"


export function RecipeList() {
    
    const [title, setTitle] = useState('')
    const recipesList = useRecipesStore(state => state.recipesList)
    const { openCreateModal } = storeModal()
    const [tabs, setTabs] = useState('MenuInWeek')
    const { logout } = useAuthStore()

    return (
        <>
            <ModalCreateOrUpdateRecipe />
            <button className="btn btnLogout" onClick={logout}>Выйти</button>
            {tabs === 'AllMenu' ? 
            
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
            : <MenuInWeek />} 
            <div className="tabsBlock">           
                <button onClick={() => setTabs('MenuInWeek')} className="btn btnTabsSecond">Меню на неделю</button>
                <button onClick={() => setTabs('AllMenu')} className="btn btnAllMenu">Все меню</button>
            </div>
        </>
    )
}