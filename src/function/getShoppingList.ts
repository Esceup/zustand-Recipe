import type { IMenuWeek, IRecipe } from '../types/types';

export const getShoppingList = (itemRecipe: IMenuWeek['recipesForWeek'], allRecipes: IRecipe[]) => {
   const allIngredients = new Map<string, { title: string; valueAndUnit: string[] }>();
   if (!itemRecipe || !allRecipes) return [];
   itemRecipe.forEach((includeRecipe) => {
      const recipe = allRecipes.find((rec) => rec.id === includeRecipe.id);

      if (recipe?.ingredients) {
         recipe.ingredients?.map((ingredient) => {
            const key = ingredient.title.trim().toLowerCase();
            const value = `${ingredient.value} ${ingredient.unit}`;
            if (allIngredients.has(key)) {
               allIngredients.get(key)?.valueAndUnit.push(value);
            } else {
               allIngredients.set(key, {
                  title: ingredient.title,
                  valueAndUnit: [value],
               });
            }
         });
      }
   });
   const result = Array.from(allIngredients.entries()).map(([id, data]) => ({
      id,
      title: data.title,
      value: data.valueAndUnit.join(', '),
   }));
   return result.sort((a, b) => a.title.localeCompare(b.title));
};
