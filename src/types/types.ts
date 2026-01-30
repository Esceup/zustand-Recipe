export interface IStep {
    id: string;
    title: string;
}
export interface IIngredient {
    title: string;
    count?: string;
    weight?: string;
}

export interface IRecipe {
    id: string;
    title: string,
    desc: string;
    ingredients: IIngredient[],
    steps: IStep[];
}