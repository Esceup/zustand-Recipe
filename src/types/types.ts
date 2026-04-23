export interface IStep {
   id: string;
   title: string;
}
export interface IIngredient {
   id: string;
   title: string;
   value: string;
   unit: string;
}

export interface IRecipe {
   id: string;
   title: string;
   desc: string;
   ingredients: IIngredient[];
   steps: IStep[];
}
export interface IRecipesForWeek {
   id: string;
   title: string;
}
export interface IMenuWeek {
   id: string;
   title: string;
   recipesForWeek: IRecipesForWeek[];
}
