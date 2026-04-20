import { type FC } from "react"
import { useMenuWeekStore } from "../../store/storeMenuWeek";
import { useRecipesStore } from "../../store/storeRecipes";
import type { IMenuWeek } from "../../types/types";
import { useAuthStore } from "../../store/storeAuth";
interface ModalMenuWeekProps {
    show: boolean;
    setShow: (id: boolean) => void;
    menuItemProp: IMenuWeek;
}

export const ModalMenuWeek: FC<ModalMenuWeekProps> = ({ show, setShow, menuItemProp }) => {
    
    const { recipesList } = useRecipesStore()
    const { menuWeek, addExistedRecipe, deleteExistedMenuItem } = useMenuWeekStore()
    const userId = useAuthStore(state => state.user?.uid)
    if(!userId) return null
   
    const includesRecipeLength = menuWeek.find(filterItem => filterItem.id == menuItemProp.id)
  
    return (
        <>           
            
            <div className={`modalMenuWeek ${show ? 'active' : ''}`}>
                <button className="btn btnClose" onClick={() => setShow(false)}><i className="fa-solid fa-xmark"></i></button>

                <h3>Меню на выбор</h3>
                <ul className="listReset popularIngredientsListMain">
                    {
                        recipesList?.sort((a, b) => a.title.localeCompare(b.title)).map((item) => 
                        <li 
                            onClick={() => addExistedRecipe(userId, menuItemProp?.id, item.id, item.title)} 
                            className="popularIngredientItem" key={item.id}>
                                {item.title}
                            </li>
                        )
                    }
                </ul>

                {includesRecipeLength?.recipesForWeek?.length 
                
                ?  ( 
                    <>
                    
                    <h3>Уже в этом меню</h3>
                    <ul className="popularIngredientsListMain">
                        
                        {menuWeek.filter(filterItem =>
                            filterItem.id == menuItemProp.id).map(menuItem => 
                                menuItem.recipesForWeek.map(recipe =>
                                                                
                        <li 
                            className="popularIngredientItem menuIncludeItem" 
                            key={recipe.id}>{recipe.title}
                                <span 
                                    className=" deleteIngredient" 
                                    onClick={() => deleteExistedMenuItem(userId, menuItem.id, recipe.id)}>
                                        x
                                </span>
                            </li>

                        ))}
                    </ul>
                    </>)
                
                
                : (<h3>В меню ничего нет</h3> )
                } 
                
                
            </div>
            <div  onClick={() => setShow(false)} className={`modalMenuWeekBack ${show ? 'active' : ''}`}></div>
        </>
    )
}