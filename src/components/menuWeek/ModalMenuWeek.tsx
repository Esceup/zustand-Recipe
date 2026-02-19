import { useEffect, useState, type FC } from "react"
import { useMenuWeek } from "../../store/storeMenuWeek";
import { useRecipesStore } from "../../store/store";
import type { IMenuWeek } from "../../types/types";



interface ModalMenuWeekProps {
    show: boolean;
    setShow: (id: boolean) => void;
    menuItemProp: IMenuWeek;
}

export const ModalMenuWeek: FC<ModalMenuWeekProps> = ({ show, setShow, menuItemProp }) => {
    // const [title, setTitle] = useState('')
    const { menuWeek, addIncludeRecipe, deleteInclideMenuItem } = useMenuWeek()
    const { recipesList } = useRecipesStore()

   


    return (
        <>
            
                <div className={`modalMenuWeek ${show ? 'active' : ''}`}>
                    <button className="btn btnClose" onClick={() => setShow(false)}>x</button>

                    {/* <input 
                        type="text" 
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="mb-15px"
                    /> */}
                    <h3>Меню на выбор</h3>
                     <ul className="listReset popularIngredientsListMain">
                        {
                            recipesList?.sort((a, b) => a.title.localeCompare(b.title)).map((item) => 
                            <li 
                                onClick={() => addIncludeRecipe(menuItemProp?.id, item.id, item.title)} 
                                className="popularIngredientItem" key={item.id}>
                                    {item.title}
                                </li>
                            )
                        }


                    </ul>
                    {menuItemProp?.includesRecipe?.length == undefined  || menuItemProp?.includesRecipe?.length < 1 
                    
                    ? <h3>В меню ничего нет</h3> 
                    
                    : <>
                        <h3>Уже в этом меню</h3>
                        <ul className="popularIngredientsListMain">
                            
                            {menuWeek?.filter(filterItem => filterItem.id == menuItemProp?.id).map(menuItem => menuItem.includesRecipe?.map(includeItem => 
                            <li 
                                className="popularIngredientItem menuIncludeItem" 
                                key={includeItem.id}>{includeItem.title}
                                    <span 
                                        className=" deleteIngredient" 
                                        onClick={() => deleteInclideMenuItem(menuItem.id, includeItem.id)}>
                                            x
                                    </span>
                                </li>
                            ))}
                        </ul>
                      </>
                    }

                    
                   
                </div>
                <div  onClick={() => setShow(false)} className={`modalMenuWeekBack ${show ? 'active' : ''}`}></div>

        </>
    )
}