export interface IStep {
    id: string;
    title: string;
}
export interface IIngredient {
    id: string;
    title: string;
    unit: string;
}

export interface IRecipe {
    id: string;
    title: string,
    desc: string;
    ingredients: IIngredient[],
    steps: IStep[];
}
