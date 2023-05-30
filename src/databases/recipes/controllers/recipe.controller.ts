import pool from "../pool";
import { Recipe, RecipePostgres, RecipeSearch } from "../models/recipe.model";
import ApiError, { errorType } from "../../../types/ApiError";
import convertKeysToCamelCase from "../../../utils/convertKeysToCamelCase";

export default class RecipeController {
  public async addRecipes(recipes: Recipe[], searchTerm: string) {
    try {
      const client = await pool.connect();

      const query = `
      INSERT INTO recipes (
        id,
        title,
        ready_in_minutes,
        servings,
        source_url,
        source_name,
        dish_types,
        spoonacular_source_url,
        likes,
        image,
        ingredients,
        nutrients,
        summary,
        instructions
      )
      VALUES 
    `;

      const values = [];

      for (const recipe of recipes) {
        values.push([
          recipe.id,
          recipe.title,
          recipe.readyInMinutes,
          recipe.servings,
          recipe.sourceUrl,
          recipe.sourceName,
          recipe.dishTypes,
          recipe.spoonacularSourceUrl,
          recipe.likes,
          recipe.image,
          JSON.stringify(recipe.ingredients),
          JSON.stringify(recipe.nutrients),
          recipe.summary,
          recipe.instructions,
        ]);
      }
      const recipesId = recipes.map((r) => r.id);
      const placeholderCount = 14; // Number of placeholders per value
      const valuePlaceholders = values
        .map((_, index) => {
          const placeholders = Array.from(
            { length: placeholderCount },
            (_, i) => `$${index * placeholderCount + i + 1}`
          );
          return `(${placeholders.join(", ")})`;
        })
        .join(",\n");

      await client.query(
        query + valuePlaceholders + "ON CONFLICT DO NOTHING",
        values.flat()
      );

      const addToSearchTableQuery = `
        INSERT INTO search_term_recipes (recipe_id, search_term)
        VALUES 
      `;
      const recipesIdValues = recipesId
        .map((id) => `('${id}', '${searchTerm}')`)
        .join(", ");
      await client.query(addToSearchTableQuery + recipesIdValues);
      client.release();
    } catch (err) {
      console.error("Error inserting recipes:", err);
    }
  }

  public async getRecipes(searchTerm: string): Promise<RecipeSearch[]> {
    const client = await pool.connect();
    const query = `SELECT id, title, ready_in_minutes, image, likes, dish_types FROM search_term_recipes
                  LEFT JOIN recipes ON recipes.id = search_term_recipes.recipe_id
                  WHERE search_term_recipes.search_term = '${searchTerm}';`;
    const results = await client.query(query);
    client.release();
    return convertKeysToCamelCase(results.rows);
  }

  public async getRecipeById(id: number): Promise<Recipe> {
    const client = await pool.connect();
    const query = `SELECT * from recipes WHERE id = $1;`;
    const results = await client.query(query, [id]);
    const recipe = results.rows[0];

    if (!recipe || !recipe.ingredients || !recipe.nutrients) {
      throw new ApiError(errorType.NOT_FOUND, "recipe not found");
    }
    // const recipePostgres: RecipePostgres = rows[0]
    client.release();

    return convertKeysToCamelCase(recipe);
  }
}
