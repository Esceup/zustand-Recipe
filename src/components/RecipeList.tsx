import RecipeItem from "./RecipeItem"
import { useRecipesStore } from "../store/store"
import { ModalCreateOrUpdateRecipe } from "./ModalCreateOrUpdateRecipe"
import { storeModal } from "../store/storeModal"
import { useState } from "react"
import { IngredientsList } from "./IngredientsList"
import { MenuInWeek } from "./menuWeek/MenuInWeek"


export function RecipeList() {
    
    const [title, setTitle] = useState('')
    const recipesList = useRecipesStore(state => state.recipesList)
    const { openCreateModal } = storeModal()
    const [tabs, setTabs] = useState('main')

    return (
        <>

            {tabs === 'main' ? 
            
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
            <ModalCreateOrUpdateRecipe />
            </>
            : <MenuInWeek />} 
            <div className="tabsBlock">
                <button onClick={() => setTabs('main')} className="btn btnTabsMain">Все меню</button>
                <button onClick={() => setTabs('second')} className="btn btnTabsSecond">Меню на неделю</button>
            </div>
        </>
    )
}