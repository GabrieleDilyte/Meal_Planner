let recipeBookArr = [];

function getIngredients(arr) {
  ingrList = [];

  Object.keys(arr).forEach((key) => {
    if (key.includes("Ingredient")) {
      ingrList.push(arr[key]);
    }
  });
  return ingrList;
}

function filterRecipes(arr, mealCat, ingrList) {
  if (mealCat && mealCat !== "All" && !ingrList) {
    return arr.filter((recipe) => {
      return recipe["strCategory"] === mealCat;
    });
  } else if (ingrList) {
    return arr.filter((recipe) => {
      const mealIngr = getIngredients(recipe);
      return mealIngr.some((ingr) => ingrList.includes(ingr));
    });
  } else {
    return arr;
  }
}

function createEl(tagName, attributes) {
  const el = document.createElement(tagName);

  if (attributes) {
    Object.entries(attributes).forEach((keyValuePair) => {
      el[keyValuePair[0]] = keyValuePair[1];
    });
  }
  return el;
}

function selectEl(selector) {
  return document.querySelector(selector);
}

function generateRecipes(selectedRecipes) {
  if (selectEl("#recipeList")) {
    selectEl("#recipeList").innerHTML = null;
  } else {
    const recipeList = createEl("div", { id: "recipeList" });
    selectEl("#recipeSearch .container").append(recipeList);
  }

  selectedRecipes.forEach((recipe) => {
    const singleRecipe = createEl("div", { id: "singleRecipe" });
    const mealImg = createEl("img", {
      alt: recipe["strMeal"],
      src: recipe["strMealThumb"],
    });
    const aboutContent = createEl("div", { id: "aboutContent" });
    const mealName = createEl("h3", { textContent: recipe["strMeal"] });
    const mealCat = createEl("p", {
      textContent: "Category: " + recipe["strCategory"],
    });
    const singleRecipeBtns = createEl("div");
    const viewRecipeBtn = createEl("button", {
      id: "viewRecipeBtn",
      textContent: "Full Recipe",
    });
    const addToBookBtn = createEl("button", {
      id: "addToBookBtn",
      textContent: "Add to your recipe book",
    });
    const hr = createEl("hr");

    aboutContent.append(mealName, mealCat);
    singleRecipeBtns.append(viewRecipeBtn, addToBookBtn);
    singleRecipe.append(mealImg, aboutContent, singleRecipeBtns);
    recipeList.append(hr, singleRecipe);

    addToBookBtn.addEventListener("click", () => {
      recipeBookArr.push(recipe);
      generateRecipeBook();
    });

    viewRecipeBtn.addEventListener("click", () => {
      window.open(recipe["strSource"], "_blank");
    });
  });
}

function generateRecipeBook() {
  if (selectEl("#recipeBookList")) {
    selectEl("#recipeBookList").innerHTML = null;
  } else {
    const recipeBookList = createEl("div", { id: "recipeBookList" });
    selectEl("#recipeBook .container").append(recipeBookList);
  }

  recipeBookArr.forEach((recipe) => {
    const singleRecipe = createEl("div", { id: "singleRecipePage" });
    const mealImg = createEl("img", {
      alt: recipe["strMeal"],
      src: recipe["strMealThumb"],
    });
    const aboutContent = createEl("div", { id: "aboutContent" });
    const mealName = createEl("h3", { textContent: recipe["strMeal"] });
    const mealCat = createEl("p", {
      textContent: "Category: " + recipe["strCategory"],
    });
    const instructions = createEl("p", {
      id: "instructions",
      textContent: "Instructions: " + recipe["strInstructions"],
    });

    aboutContent.append(mealName, mealCat, instructions);
    singleRecipe.append(mealImg, aboutContent);
    recipeBookList.append(singleRecipe);
  });
}

selectEl("button#searchAPI").addEventListener("click", () => {
  const mealCat = selectEl("#mealCategory").value;
  const ingrList = selectEl("#ingredients").value;

  fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=b")
    .then((response) => response.json())
    .then((result) => {
      const selectedRecipes = filterRecipes(result["meals"], mealCat, ingrList);
      generateRecipes(selectedRecipes);
    })
    .catch((err) => console.log(err));
});
