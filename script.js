const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

function searchMeal(e) {
  e.preventDefault();

  single_mealEl.innerHTML = "";

  const term = search.value;

  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
        console.log(data);
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no reults with this term. Please try again.</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
        <div class="meal">
        <div class="meal-info" data-mealId="${meal.idMeal}"><h3>${meal.strMeal}</h3></div>
        <img src="${meal.strMealThumb}" alt="meal"/>
        </div>
    `
            )
            .join("");
        }
      });
    search.value = "";
  }
}

function getMealById(mealId) {
  if (mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];
        addMealToDOM(meal);
      });
  }
}

function addMealToDOM(meal) {
  const ingredients = [];

  [...Array(20).keys()].forEach((m, i) => {
    if (meal[`strIngredient${i + 1}`]) {
      ingredients.push(
        `${meal[`strIngredient${i + 1}`]} - ${meal[`strMeasure${i + 1}`]}`
      );
    }
  });

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

random.addEventListener("click", () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      resultHeading.innerHTML = "";
      mealsEl.innerHTML = "";
      addMealToDOM(data.meals[0]);
    });
});

submit.addEventListener("click", searchMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      false;
    }
  });

  if (mealInfo) {
    getMealById(mealInfo.getAttribute("data-mealId"));
  }
});
