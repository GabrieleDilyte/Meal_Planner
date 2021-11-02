let recipeBookArr = [];
let mealPlan = [];
const weekdayArr = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealArr = ["Breakfast", "Lunch", "Dinner"];

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

function getIngredients(arr) {
  ingrList = [];

  Object.keys(arr).forEach((key) => {
    if (key.includes("Ingredient") && arr[key]) {
      ingrList.push(arr[key].toLowerCase());
    }
  });
  return ingrList;
}

function getMeasure(arr) {
  measureList = [];

  Object.keys(arr).forEach((key) => {
    if (key.includes("Measure") && arr[key]) {
      measureList.push(arr[key].toLowerCase());
    }
  });
  return measureList;
}

function filterRecipes(arr, mealName, mealCat) {
  let newArr = arr;

  if (mealName) {
    newArr = newArr.filter((recipe) => {
      return recipe["strMeal"].toLowerCase().includes(mealName.toLowerCase());
    });
  }

  if (mealCat && mealCat !== "All") {
    newArr = newArr.filter((recipe) => {
      return recipe["strCategory"] === mealCat;
    });
  }

  return newArr;
}

function generateSearchForm() {
  const searchForm = createEl("form");
  const nameLabel = createEl("label", {
    for: "mealName",
    textContent: "Name: ",
  });
  const nameInput = createEl("input", {
    name: "mealName",
    type: "text",
    placeholder: "Banana pancakes",
  });
  const categoryList = createEl("select", { name: "category" });
  const categoryLabel = createEl("label", {
    for: "category",
    textContent: "Category: ",
  });
  ["All", "Vegetarian", "Side", "Dessert", "Beef"].forEach((element) => {
    const option = createEl("option", { value: element });
    option.textContent = element;
    categoryList.append(option);
  });
  searchForm.append(
    nameLabel,
    createEl("br"),
    nameInput,
    createEl("br"),
    categoryLabel,
    createEl("br"),
    categoryList
  );

  return searchForm;
}

function generateSearchRecipes(selectedRecipes) {
  if (selectEl("#recipeList")) {
    selectEl("#recipeList").innerHTML = null;
  } else {
    const recipeList = createEl("div", { id: "recipeList" });
    selectEl("#findRecipesSect").append(recipeList);
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
      if (!recipeBookArr.some((obj) => obj["idMeal"] === recipe["idMeal"])) {
        recipeBookArr.unshift(recipe);
        localStorage.setItem(
          "recipeBookStorage",
          JSON.stringify(recipeBookArr)
        );
      }
    });

    viewRecipeBtn.addEventListener("click", () => {
      window.open(recipe["strSource"], "_blank");
    });
  });
}

function generateRecipeSearch() {
  if (selectEl("section")) {
    selectEl("section").remove();
  }
  const section = createEl("section", { id: "findRecipesSect" });
  const header = createEl("h2", { textContent: "Find Recipes" });
  const line = createEl("hr", { classList: "hr-dark" });
  const searchForm = generateSearchForm();
  const searchBtn = createEl("button", { textContent: "Search" });

  selectEl("main").append(section);
  section.append(header, line, searchForm, searchBtn);

  searchBtn.addEventListener("click", () => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=b")
      .then((response) => response.json())
      .then((result) => {
        const selectedRecipes = filterRecipes(
          result["meals"],
          searchForm.mealName.value,
          searchForm.category.value
        );
        generateSearchRecipes(selectedRecipes);
      })
      .catch((err) => console.log(err));
  });
}

function generateRecipes(recipeArr) {
  const recipeBookList = createEl("div", { id: "recipeBookList" });

  recipeArr.forEach((recipe) => {
    const singleRecipe = createEl("div", { id: "singleRecipePage" });
    const mealImg = createEl("img", {
      alt: recipe["strMeal"],
      src: recipe["strMealThumb"],
    });
    const aboutContent = createEl("div", { id: "aboutContent" });
    const mealName = createEl("h2", { textContent: recipe["strMeal"] });
    const mealCat = createEl("p", { textContent: recipe["strCategory"] });
    const ingredients = createEl("ul", { id: "ingredientsList" });
    const ingrList = getIngredients(recipe);
    const measureList = getMeasure(recipe);

    ingrList.forEach((ingredient, index) => {
      const li = createEl("li", {
        textContent: measureList[index] + " " + ingredient,
      });
      ingredients.append(li);
    });

    const instructions = createEl("p", {
      id: "instructions",
      innerHTML: "Instructions: ".bold() + recipe["strInstructions"],
    });
    const deleteBtn = createEl("button", { textContent: "Delete" });
    const addToPlanner = createEl("button", {
      textContent: "Add to planner",
    });

    aboutContent.append(
      mealName,
      mealCat,
      ingredients,
      instructions,
      deleteBtn,
      addToPlanner
    );
    singleRecipe.append(mealImg, aboutContent);
    recipeBookList.append(singleRecipe);

    deleteBtn.addEventListener("click", () => {
      singleRecipe.remove();
      recipeBookArr.splice(recipeBookArr.indexOf(recipe), 1);
      localStorage.setItem("recipeBookStorage", JSON.stringify(recipeBookArr));
    });

    addToPlanner.addEventListener("click", () => {
      const addFormDiv = createEl("div", { id: "addForm" });
      const form = createEl("form");
      const weekdayInput = createEl("select", { name: "weekday" });
      const weekdaylabel = createEl("label", {
        for: "weekday",
        textContent: "Day: ",
      });
      weekdayArr.forEach((day) => {
        const option = createEl("option", { value: day, textContent: day });
        weekdayInput.append(option);
      });
      const mealInput = createEl("select", { name: "meal" });
      const mealLabel = createEl("label", {
        for: "meal",
        textContent: "Meal: ",
      });
      mealArr.forEach((meal) => {
        const option = createEl("option", { value: meal, textContent: meal });
        mealInput.append(option);
      });
      const addBtn = createEl("button", { textContent: "Add" });
      const cancelBtn = createEl("button", { textContent: "Cancel" });

      addToPlanner.remove();
      form.append(
        weekdaylabel,
        weekdayInput,
        createEl("br"),
        mealLabel,
        mealInput
      );
      addFormDiv.append(form, addBtn, cancelBtn);
      aboutContent.append(addFormDiv);

      addBtn.addEventListener("click", () => {
        mealPlan.forEach((day) => {
          if (day["Weekday"] === weekdayInput.value) {
            day[mealInput.value] = recipe["strMeal"];
          }
        });

        localStorage.setItem("mealPlanStorage", JSON.stringify(mealPlan));
        addFormDiv.remove();
        aboutContent.append(addToPlanner);
      });

      cancelBtn.addEventListener("click", () => {
        addFormDiv.remove();
        aboutContent.append(addToPlanner);
      });
    });
  });
  return recipeBookList;
}

function generateRecipeBook() {
  if (selectEl("section")) {
    selectEl("section").remove();
  }
  const section = createEl("section", { id: "recipeBookSec" });
  const header = createEl("h2", { textContent: "Your Recipe Book" });
  const line = createEl("hr", { classList: "hr-dark" });
  const searchForm = generateSearchForm();
  const filterBtn = createEl("button", { textContent: "Filter" });
  let recipeBookList = generateRecipes(recipeBookArr);

  selectEl("main").append(section);
  section.append(header, line, searchForm, filterBtn, recipeBookList);

  filterBtn.addEventListener("click", () => {
    const filteredRecipes = filterRecipes(
      recipeBookArr,
      searchForm.mealName.value,
      searchForm.category.value
    );

    selectEl("#recipeBookList").remove();
    recipeBookList = generateRecipes(filteredRecipes);
    section.append(recipeBookList);
  });
}

function generatePlanner() {
  if (selectEl("section")) {
    selectEl("section").remove();
  }
  const section = createEl("section", { id: "plannerSec" });
  const header = createEl("h2", { textContent: "Your Weekly Plan" });
  const line = createEl("hr", { classList: "hr-dark" });
  const table = createEl("table");

  selectEl("main").append(section);
  section.append(header, line, table);

  const thead = createEl("thead");
  const tbody = createEl("tbody");
  const theadTr = createEl("tr");

  const theadTh = createEl("th");
  theadTr.append(theadTh);

  mealArr.forEach((label) => {
    const theadTh = createEl("th");
    theadTh.innerHTML = label;
    theadTr.append(theadTh);
  });
  thead.append(theadTr);
  table.append(thead);

  mealPlan.forEach((day) => {
    const tbodyTr = createEl("tr");

    for (i = 0; i < 4; i++) {
      const tbodyTd = createEl("td");

      tbodyTd.innerHTML = Object.values(day)[i];
      tbodyTr.append(tbodyTd);
    }
    table.append(tbodyTr);
  });
  table.append(tbody);
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("recipeBookStorage")) {
    recipeBookArr = JSON.parse(localStorage.getItem("recipeBookStorage"));
  }

  if (localStorage.getItem("mealPlanStorage")) {
    mealPlan = JSON.parse(localStorage.getItem("mealPlanStorage"));
  } else {
    weekdayArr.forEach((day) => {
      let object = {};
      object["Weekday"] = day;
      mealArr.forEach((meal) => {
        object[meal] = null;
      });
      mealPlan.push(object);
    });
  }
  generateRecipeSearch();
});

document.querySelectorAll(".service-list li").forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    element.classList.add("selected");

    switch (element.id) {
      case "findRecipes":
        generateRecipeSearch();
        break;
      case "recipeBook":
        generateRecipeBook();
        break;
      case "planner":
        generatePlanner();
        break;
      default:
        break;
    }
  });
});
