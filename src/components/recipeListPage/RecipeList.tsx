
import { ModalCreateOrUpdateRecipe } from "../modal/ModalCreateOrUpdateRecipe"
import { useState } from "react"
import { MenuInWeek } from "../menuWeekPage/MenuInWeek"
import { useAuthStore } from "../../store/authStore"
import { Ingredients } from "../ingredientsPage/Ingredients"
import  { MenuWeekPage } from "../menuWeekPage/MenuWeekPage"


export function RecipeList() {
    
    

    
    const [tabs, setTabs] = useState('MenuInWeek')
    const { logout } = useAuthStore()

    return (
        <>
            <ModalCreateOrUpdateRecipe />
            <button className="btn btnLogout" onClick={logout}>Выйти</button>
            {tabs === 'AllMenu' ? <MenuWeekPage />
            :  tabs === 'MenuInWeek' ? <MenuInWeek />
            : tabs === 'Ingredients' ? <Ingredients /> : ''}

            <div className="tabsBlock">           
                <button onClick={() => setTabs('MenuInWeek')} className="btn btnAllMenu">
                    <div>                     
                        <i className="fa-solid fa-utensils"></i>
                        <div className="underTitleTabs">Меню на неделю</div>
                    </div></button>
                <button onClick={() => setTabs('AllMenu')} className="btn btnAllMenu">
                    <i className="fa-solid fa-list"></i>
                        <div className="underTitleTabs">Список рецептов</div>
                    </button>
                    <button onClick={() => setTabs('Ingredients')} className="btn btnAllMenu">
                    <i className="fa-solid fa-carrot "></i>
                        <div className="underTitleTabs">Ингредиенты</div>
                    </button>
            </div>
        </>
    )
}