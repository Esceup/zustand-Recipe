import { useState } from "react"

import { useRecipesStore } from "../../store/store"
import { useMenuWeek } from "../../store/storeMenuWeek"
import { ModalMenuWeek } from './ModalMenuWeek';
import type { IMenuWeek } from "../../types/types";


export const MenuInWeek = () => {
    const [show, setShow] = useState(false)
    const [menuItemProp, menuItemPropSet] = useState<IMenuWeek>({ 
    id: '', 
    title: '', 
    includesRecipe: [] 
})
    const [title, setTitle] = useState('')
    const [titleSearch, setTitleSearch] = useState('')
    const { menuWeek, addNewMenu, deleteMenu } = useMenuWeek()
    const { recipesList } = useRecipesStore()

    const handlAddeNewMenu = () => {
        if(title == '' || title.length <= 3) return
        if(menuWeek.some(item => item.title.toLowerCase() === title.toLowerCase())) return
        addNewMenu(title)
    }

    return (

        <>
            <h2>Меню на неделю</h2>           
            <div>
                <label htmlFor="" className="mr-5">Добавить</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
                <button onClick={handlAddeNewMenu}>+</button>
            </div>
            <div>
                <label htmlFor="">Поиск</label>
                <input 
                    type="text" 
                    value={titleSearch}
                    onChange={(event) => setTitleSearch(event.target.value)}
                />
            </div>
           
           
     
            <ul>
                {menuWeek?.filter(filterItem => filterItem.title.toLowerCase().includes(titleSearch.toLowerCase())).map((item) => 
                    
                        <li key={item.id} className="recipeItem">
                            <h3 onClick={() => {
                                setShow(true)
                                menuItemPropSet(item)
                            }} className="menuWeekItemTitle">{item.title}</h3>
                            <ul className="recipeList mb-15px">
                                {item.includesRecipe?.map(includeItem => 
                                    recipesList?.map(recipeItem => 
                                        recipeItem.title == includeItem.title ? 
                                        <li className="2" key={recipeItem.id}>{recipeItem.title}</li> : '')
                                    )
                            }
                          
                            </ul> 
                            <button className="btn" onClick={() => deleteMenu(item.id)}>Удалить меню</button>                       
                        </li>

                        
                    
            )}
            <ModalMenuWeek show={show} setShow={setShow} menuItemProp={menuItemProp}/>
             
            </ul>
            
        </>
    )
}