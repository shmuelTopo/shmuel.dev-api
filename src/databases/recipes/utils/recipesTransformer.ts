import fs from "fs";

const importantNutrients = [
  "Protein",
  "Sodium",
  "Cholesterol",
  "Sugar",
  "Net Carbohydrates",
  "Carbohydrates",
  "Saturated Fat",
  "Fat",
  "Fiber",
  "Calories",
];

interface NutrientFact {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface Nutrients {
  nutritionFacts: {
    vitamins: NutrientFact[];
    Calories: NutrientFact;
    Fat: NutrientFact;
    "Saturated Fat": NutrientFact;
    Carbohydrates: NutrientFact;
    "Net Carbohydrates": NutrientFact;
    Sugar: NutrientFact;
    Cholesterol: NutrientFact;
    Sodium: NutrientFact;
    Protein: NutrientFact;
    Fiber: NutrientFact;
  };
  caloriesBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightPerServing: { amount: number; unit: string; servings: number };
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  sourceName: string;
  dishTypes: string[];
  spoonacularSourceUrl: string;
  likes: number;
  image: string;
  ingredients: Ingredient[];
  nutrients: Nutrients;
  summary: string;
  instructions: string[];
}

export interface RecipePostgres {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  sourceName: string;
  dishTypes: string[];
  spoonacularSourceUrl: string;
  likes: number;
  image: string;
  ingredients: string;
  nutrients: string;
  summary: string;
  instructions: string[];
}

function searchResultsTransformer(searchResults: any): Recipe[] {
  return searchResults
    .map((recipe: any) => {
      if (!recipe.analyzedInstructions.length) return;
      const {
        id,
        title,
        readyInMinutes,
        servings,
        sourceUrl,
        sourceName,
        dishTypes,
        aggregateLikes,
        spoonacularSourceUrl,
        image,
        summary,
        analyzedInstructions,
        nutrition,
      } = recipe;

      const nutritionFacts = nutrition.nutrients.reduce(
        (nutritionObj: any, current: any) => {
          if (importantNutrients.includes(current.name)) {
            nutritionObj[current.name] = current;
          } else {
            nutritionObj.vitamins.push(current);
          }
          return nutritionObj;
        },
        { vitamins: [] }
      );
      const theRecipe = {
        id,
        title,
        readyInMinutes,
        servings,
        sourceUrl,
        sourceName,
        dishTypes,
        spoonacularSourceUrl,
        likes: aggregateLikes,
        image,
        ingredients: nutrition.ingredients.map((ing: any) => {
          return {
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          };
        }),
        nutrients: {
          nutritionFacts,
          caloriesBreakdown: nutrition.caloricBreakdown,
          weightPerServing: nutrition.weightPerServing,
        },
        summary,
        instructions: analyzedInstructions[0].steps.map(
          (step: any) => step.step
        ),
      };

      theRecipe.nutrients.weightPerServing.servings = theRecipe.servings;
      return theRecipe;
    })
    .filter((r: any) => r !== undefined);
}

fs.readFileSync;

export { searchResultsTransformer };
