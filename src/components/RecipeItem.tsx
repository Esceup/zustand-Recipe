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
                         
            {recipe.desc ? <div><span className="descItem">Описание:</span><span>{recipe.desc}</span></div> : ''}
            
            <div>
                <h3 style={{textAlign: 'left'}}>Продукты:</h3> 
                <ul className="ingredientsList">{recipe.ingredients?.map((item) => (
                    <li key={item.id}><span>{item.title}</span> - {item.unit}</li>
                ))}
            </ul>
            </div>
            <div><h2>Пошаговый рецепт:</h2></div>
            <button onClick={handleUpdate} className="btn btnEdit">Изм.</button>
            <button onClick={handleRemove} className="btn">Удалить</button>
        </li>
    )
}

export default RecipeItem