import express from "express";
import RecipeController from "../../databases/recipes/controllers/recipe.controller";
import * as dotenv from "dotenv";
import ApiError, { errorType } from "../../types/ApiError";
import { searchResultsTransformer } from "../../databases/recipes/utils/recipesTransformer";

import axios from "axios";

dotenv.config();

const recipeController = new RecipeController();
const router = express.Router();

router.get("/", async (_req, res) => {
  res.status(400).json("bad request");
});

router.get("/search", async (req, res, next) => {
  const query = String(req.query.query);
  if (!["pizza", "bread", "olives", "olive-bread", "banana-bread"].includes(query)) {
    return next(
      new ApiError(
        errorType.NOT_FOUND,
        "query not found, you can search for pizza bread or olives"
      )
    );
  }
  try {
    let searchResults = await recipeController.getRecipes(query);
    if (!searchResults.length) {
      // const recipes = await axios.get(
      //   `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=100&addRecipeInformation=true&addRecipeNutrition=true&apiKey=${process.env.API_KEY}`
      // );
      const recipes = await axios.get(
        `https://shmuel.dev/files/${query}-sample-search.json`
      );
      await recipeController.addRecipes(
        searchResultsTransformer(recipes.data.results),
        query
      );

      searchResults = await recipeController.getRecipes(query);
    }

    res.json(searchResults);
  } catch (error: any) {
    next(error);
  }
});

router.get("/recipe/:id", async (req, res, next) => {
  try {
    if (isNaN(Number(req.params.id))) {
      return next(
        new ApiError(errorType.BAD_REQUEST, `please make sure 'id' is number`)
      );
    }

    const recipeId = Number(req.params.id);
    let recipe = await recipeController.getRecipeById(recipeId);

    if (!recipe) {
      next(new ApiError(errorType.NOT_FOUND, "recipe not found"));
    }

    res.json(recipe);
  } catch (error: any) {
    next(error);
  }
});

router.use("*", (_req, res) => {
  res.status(404).json("not found");
});

export default router;
