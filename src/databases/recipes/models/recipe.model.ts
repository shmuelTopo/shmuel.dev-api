import pool from "../pool";
export { Recipe, RecipePostgres } from "../utils/recipesTransformer";
export interface RecipeSearch {
  id: string;
  title: string;
  readyInMinutes: number;
  dishTypes: string[];
  likes: number;
  image: string;
}
export const createRecipeTable = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY,
        title VARCHAR,
        ready_in_minutes INTEGER,
        servings INTEGER,
        source_url VARCHAR,
        source_name VARCHAR,
        dish_types TEXT[],
        spoonacular_source_url VARCHAR,
        likes INTEGER,
        image VARCHAR,
        ingredients JSONB,
        nutrients JSONB,
        summary TEXT,
        instructions TEXT[]
      );
      ALTER TABLE recipes ADD CONSTRAINT recipes_id_unique UNIQUE (id);

    `);
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    client.release();
  }
};

export const createSearchTermTable = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS search_term_recipes (
        recipe_id INTEGER REFERENCES recipes(id),
        search_term VARCHAR(255)
      )
    `);
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    client.release();
  }
};