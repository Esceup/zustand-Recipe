
import { ModalCreateOrUpdateRecipe } from "../modal/ModalCreateOrUpdateRecipe"
import { useState } from "react"
import { MenuInWeek } from "../menuWeekPage/MenuInWeek"
import  { AllListRecipe } from "./AllListRecipe"
import { ModalUserProfile } from "../modal/ModalUserProfile"
import { AllListIngredients } from "../ingredientsPage/AllListIngredients"



export function TabsBlock() {

    const [tabs, setTabs] = useState('AllListInWeek')
    const [showModal, setShowModal] = useState(false)
    

    return (
        <>
            <button className="btn btnLogout" onClick={() => setShowModal(!showModal)}><i className="fa-solid fa-gear"></i></button>
            {tabs === 'AllListInWeek' ? <MenuInWeek />
                : tabs === 'AllListRecipe' ? < AllListRecipe />
                : tabs === 'AllListIngredients' ? <AllListIngredients /> : ''}

            <div className="tabsBlock">           
                <button onClick={() => setTabs('AllListInWeek')} className={`btn btnAllMenu ${tabs === 'AllListInWeek' ? 'active' : ''}`}>
                    <div>                     
                        <i className="fa-solid fa-utensils"></i>
                        <div className="underTitleTabs">Меню на неделю</div>
                    </div></button>
                <button onClick={() => setTabs('AllListRecipe')} className={`btn btnAllMenu ${tabs === 'AllListRecipe' ? 'active' : ''}`}>
                    <i className="fa-solid fa-list"></i>
                        <div className="underTitleTabs">Список рецептов</div>
                    </button>
                    <button onClick={() => setTabs('AllListIngredients')} className={`btn btnAllMenu ${tabs === 'AllListIngredients' ? 'active' : ''}`}>
                    <i className="fa-solid fa-carrot "></i>
                        <div className="underTitleTabs">Ингредиенты</div>
                </button>
            </div>
            <ModalUserProfile showModal={showModal} setShowModal={setShowModal}/>
            <ModalCreateOrUpdateRecipe />
        </>
    )
}