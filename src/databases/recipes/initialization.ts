import { createRecipeTable, createSearchTermTable } from "./models/recipe.model";

export default function initializeRecipesDb() {
  createRecipeTable().catch((error) => {
    console.error("Error creating users table:", error);
  });

   createSearchTermTable().catch((error) => {
     console.error("Error creating users table:", error);
   });
}
