import { useState } from "react"

import { useRecipesStore } from "../../store/store"
import { useMenuWeek } from "../../store/storeMenuWeek"
import { ModalMenuWeek } from './ModalMenuWeek';
import type { IMenuWeek } from "../../types/types";


export const MenuInWeek = () => {
    const [show, setShow] = useState(false)
    const [active, setActive] = useState(false)
    const [menuItemProp, menuItemPropSet] = useState<IMenuWeek>({ 
        id: '', 
        title: '', 
        includesRecipe: [],
        editMode: false
    })  
    const [titleItemEdit, setTitleItemEdit] = useState('')
    const [title, setTitle] = useState('')
    const [titleSearch, setTitleSearch] = useState('')
    const { menuWeek, addNewMenu, deleteMenu, editTitleMenu, toggleEditmenu } = useMenuWeek()
    const { recipesList } = useRecipesStore()

    const handlAddeNewMenu = () => {
        if(title == '' || title.length <= 3) return
        if(menuWeek.some(item => item.title.toLowerCase() === title.toLowerCase())) return
        addNewMenu(title)
    }


    return (

        <div className="menuWeek">
            <h1>Меню на неделю</h1>    
                 
            <div className="flexBlockInputAdd">
               
                <input 
                    type="text" 
                    value={title}
                    className="inputMenuWeekAdd"
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder=""
                />
                <button onClick={handlAddeNewMenu} className="btn btnAdd btn-gradient">Добавить</button>
                
            </div>
            <div>
                <h3 className="searchLabel">Поиск</h3>
                <div className="flexBlockInputAdd">
                    <input 
                    type="text" 
                    value={titleSearch}
                    className="searchInput"
                    onChange={(event) => setTitleSearch(event.target.value)}
                    placeholder=""
                />
                <i className="searchInputAbsolute fa-solid fa-magnifying-glass"></i>
                </div>
            </div>
           
           
     
            <ul className="recipeList">
                {menuWeek?.filter(filterItem => 
                    filterItem.title.toLowerCase().includes(titleSearch.toLowerCase())).map((item) => 
                    
                        <li key={item.id} className="recipeItem">
                            <h3 className="menuWeekItemTitle">
                                <span  onClick={() => {
                                    setShow(true)
                                    menuItemPropSet(item)
                                    }} 
                                    className={!item.editMode ? 'spanTitleItem active' : 'spanTitleItem'} >
                                    {item.title}
                                </span>

                            <input 
                                className={`input-reset ${!item.editMode ? 'titleItemEdit' : 'titleItemEdit active'}`}
                                type="text" 
                                value={titleItemEdit}                                
                                onChange={(e) => {                                    
                                    setTitleItemEdit(e.target.value)          
                                }}/> 
                            
                            <button className="btn-reset ml-5px" onClick={() => {                           
                                    toggleEditmenu(item.id, true)
                                    if(item.editMode === true) {
                                        toggleEditmenu(item.id, false)
                                        editTitleMenu(item.id, titleItemEdit)  
                                    
                                    
                                }
                                setTitleItemEdit(item.title)
                                setActive(!active)
                            }
                            }><i className={`fa-solid ${active ? "fa-check " : "fa-pencil"} `}></i>
                            </button> 
                            <button 
                                className="btn-reset" 
                                onClick={() => {
                                    let res = confirm('Точно удалить?')
                                    if(!res) return
                                    deleteMenu(item.id)
                                }}>
                                    <i className="fa-solid fa-trash-can"></i>
                            </button>   
                            </h3>
                            <ul className="recipeList mb-15px">
                                 {item.includesRecipe?.map(includeItem => 
                                    recipesList?.map((recipeItem, index) => 
                                        recipeItem.title == includeItem.title ? 
                                        <li className="2" key={recipeItem.id}>{index + 1}. {recipeItem.title}</li> : '')
                                    )
                             }
                          
                            </ul> 
                                                
                        </li>

                        
                    
            )}
            <ModalMenuWeek show={show} setShow={setShow} menuItemProp={menuItemProp}/>
             
            </ul>
            
        </div>
    )
}