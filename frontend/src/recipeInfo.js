const getRecipeInfo = async (id) => {
  try {
    const result = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=2b14cdb3c6df4349be2a2bf80f70ae77`);
    if (!result.ok) {
      throw result;
    }
    const data = await result.json();
    const newRecipe = {};
    const keys = ['title', 'id', 'image', 'servings', 'readyInMinutes', 'sourceUrl'];
    for (const key of keys) {
      newRecipe[key] = data[key];
    }
    newRecipe.nutrients = filterNutrients(data.nutrition.nutrients);
    newRecipe.ingredients = [];
    for (const ingredients of data.extendedIngredients) {
      const newIngredients = {};
      newIngredients.name = ingredients.name;
      newIngredients.amount = ingredients.amount;
      newIngredients.unit = ingredients.unit;
      newIngredients.image = ingredients.image;
      newRecipe.ingredients.push(newIngredients);
    }
    newRecipe.instructions = await getInstructionsInfo(id);
    return newRecipe;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const getInstructionsInfo = async (id) => {
  try {
    const result = await fetch(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=2b14cdb3c6df4349be2a2bf80f70ae77`);
    if (!result.ok) {
      throw result;
    }
    const data = await result.json();
    if (data.length === 0) {
      return [];
    }
    const instructions = await data[0].steps.map((elem) => {
      return elem.step;
    });

    return instructions;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const filterNutrients = (nutrients) => {
  const nutrientsToKeep = ['Calories', 'Fat', 'Saturated Fat',
    'Carbohydrates', 'Sugar', 'Sodium', 'Protein', 'Fiber'];
  const filterNutrients = nutrients.filter((nutr) => nutrientsToKeep.includes(nutr.name));
  return filterNutrients;
};

export default getRecipeInfo;
