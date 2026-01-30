import type { FC } from "react"
import { useRecipesStore } from "../store/store"
import type { IRecipe } from "../types/types"

import { storeModal } from "../store/storeModal";

interface ItemProps {
    recipe: IRecipe;
}


const RecipeItem:FC<ItemProps> = ({ recipe }) => {

    const removeRecipe = useRecipesStore(state => state.removeRecipe)
    const { openEditModal } = storeModal()


    const handleRemove = () => {
        removeRecipe(recipe.id)
    }

    const handleUpdate = () => openEditModal(recipe)

   
    return (
        
        <li className='recipeItem' key={recipe.id}>               
            <h2>{recipe.title}</h2>
            <div>
                <span className="descItem">Описание:</span>
                <span> {recipe.desc}</span>
            </div>
            <div>
                <h3>Продукты:</h3> 
                <ul>{recipe.ingredients?.map((item) => (
                    <li>{item.title} - {item.count ? item.count : item.weight} </li>
                ))}
            </ul>
            </div>
            <div><h2>Пошаговый рецепт:</h2></div>
            <button onClick={handleUpdate}>Изм.</button>
            <button onClick={handleRemove}>Удалить</button>
        </li>
    )
}

export default RecipeItem