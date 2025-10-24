// Populate the area dropdown when the page loads
window.addEventListener("DOMContentLoaded", async function () {
  // Get the select element
  const areaSelect = document.getElementById("area-select");
  areaSelect.innerHTML = '<option value="">Select Area</option>';

  try {
    // Fetch list of areas from the API using async/await
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const data = await response.json();

    // If we have areas, add them to the dropdown
    if (data.meals) {
      data.meals.forEach((areaObj) => {
        const option = document.createElement("option");
        option.value = areaObj.strArea;
        option.textContent = areaObj.strArea;
        areaSelect.appendChild(option);
      });
    }
  } catch (error) {
    // Simple error logging for beginners
    console.error("Error fetching areas:", error);
  }

  // NEW: Fetch categories and populate category-select
  try {
    const catSelect = document.getElementById("category-select");
    const catResp = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    );
    const catData = await catResp.json();
    if (catData.meals) {
      catData.meals.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c.strCategory;
        opt.textContent = c.strCategory;
        catSelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
});

// Helper: build an array of "measure ingredient" strings from a detail object
function getIngredients(detail) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = detail[`strIngredient${i}`];
    const measure = detail[`strMeasure${i}`];
    if (ing && ing.trim()) {
      // Use template literal to combine measure and ingredient
      items.push(`${measure ? measure.trim() : ""} ${ing.trim()}`.trim());
    }
  }
  return items;
}

// NEW: Mock detailed meal data keyed by id for offline/fallback use
const MOCK_DETAILS = {
  52771: {
    idMeal: "52771",
    strMeal: "Spicy Arrabiata Penne",
    strCategory: "Vegetarian",
    strArea: "Italian",
    strInstructions:
      "Bring a large pot of water to a boil. Add kosher salt to the boiling water, then add the pasta. Cook according to the package instructions, about 9 minutes.\r\nIn a large skillet over medium-high heat, add the olive oil and heat until the oil starts to shimmer. Add the garlic and cook, stirring, until fragrant, 1 to 2 minutes. Add the chopped tomatoes, red chile flakes, Italian seasoning and salt and pepper to taste. Bring to a boil and cook for 5 minutes. Remove from the heat and add the chopped basil.\r\nDrain the pasta and add it to the sauce. Garnish with Parmigiano-Reggiano flakes and more basil and serve warm.",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    strIngredient1: "penne rigate",
    strIngredient2: "olive oil",
    strIngredient3: "garlic",
    strIngredient4: "chopped tomatoes",
    strIngredient5: "red chilli flakes",
    strIngredient6: "italian seasoning",
    strIngredient7: "basil",
    strMeasure1: "1 pound",
    strMeasure2: "1/4 cup",
    strMeasure3: "3 cloves",
    strMeasure4: "1 tin ",
    strMeasure5: "1/2 teaspoon",
    strMeasure6: "1/2 teaspoon",
    strMeasure7: "6 leaves",
  },

  52772: {
    idMeal: "52772",
    strMeal: "Teriyaki Chicken Casserole",
    strCategory: "Chicken",
    strArea: "Japanese",
    strInstructions:
      "Preheat oven to 350° F. Spray a 9x13-inch baking pan with non-stick spray.\r\nCombine soy sauce, ½ cup water, brown sugar, ginger and garlic in a small saucepan and cover. Bring to a boil over medium heat. Remove lid and cook for one minute once boiling.\r\nMeanwhile, stir together the corn starch and 2 tablespoons of water in a separate dish until smooth. Once sauce is boiling, add mixture to the saucepan and stir to combine. Cook until the sauce starts to thicken then remove from heat.\r\nPlace the chicken breasts in the prepared pan. Pour one cup of the sauce over top of chicken. Place chicken in oven and bake 35 minutes or until cooked through. Remove from oven and shred chicken in the dish using two forks.\r\n*Meanwhile, steam or cook the vegetables according to package directions.\r\nAdd the cooked vegetables and rice to the casserole dish with the chicken. Add most of the remaining sauce, reserving a bit to drizzle over the top when serving. Gently toss everything together in the casserole dish until combined. Return to oven and cook 15 minutes. Remove from oven and let stand 5 minutes before serving. Drizzle each serving with remaining sauce. Enjoy!",
    strMealThumb:
      "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    strIngredient1: "soy sauce",
    strIngredient2: "water",
    strIngredient3: "brown sugar",
    strIngredient4: "ground ginger",
    strIngredient5: "minced garlic",
    strIngredient6: "cornstarch",
    strIngredient7: "chicken breasts",
    strIngredient8: "stir-fry vegetables",
    strIngredient9: "brown rice",
    strMeasure1: "3/4 cup",
    strMeasure2: "1/2 cup",
    strMeasure3: "1/4 cup",
    strMeasure4: "1/2 teaspoon",
    strMeasure5: "1/2 teaspoon",
    strMeasure6: "4 Tablespoons",
    strMeasure7: "2",
    strMeasure8: "1 (12 oz.)",
    strMeasure9: "3 cups",
  },
};

// NEW: render detailed recipe into the #detail container
function renderDetail(detail) {
  const detailDiv = document.getElementById("detail");
  detailDiv.innerHTML = ""; // Clear previous detail

  // Title
  const title = document.createElement("h2");
  title.className = "detail-title";
  title.textContent = detail.strMeal;
  detailDiv.appendChild(title);

  // Image
  const img = document.createElement("img");
  img.className = "detail-img";
  img.src = detail.strMealThumb;
  img.alt = detail.strMeal;
  detailDiv.appendChild(img);

  // Ingredients list
  const ingHeading = document.createElement("h3");
  ingHeading.textContent = "Ingredients";
  detailDiv.appendChild(ingHeading);

  const ul = document.createElement("ul");
  ul.className = "ingredients";
  const ingredientList = getIngredients(detail);
  ingredientList.forEach((it) => {
    const li = document.createElement("li");
    li.textContent = it;
    ul.appendChild(li);
  });
  detailDiv.appendChild(ul);

  // Instructions
  const instrHeading = document.createElement("h3");
  instrHeading.textContent = "Instructions";
  detailDiv.appendChild(instrHeading);

  const p = document.createElement("p");
  p.className = "instructions";
  p.textContent = detail.strInstructions;
  detailDiv.appendChild(p);
}

// Helper to split an array into chunks of given size
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Helper to render meals array (used for both area and category)
function renderMeals(meals) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // clear previous

  // Chunk into groups of 9 so each .meal-grid contains up to 9 cards (3x3)
  const chunks = chunkArray(meals, 9);
  chunks.forEach((chunk) => {
    const gridDiv = document.createElement("div");
    gridDiv.className = "meal-grid";

    chunk.forEach((meal) => {
      const mealDiv = document.createElement("div");
      mealDiv.className = "meal";
      mealDiv.dataset.mealId = meal.idMeal;

      const title = document.createElement("h3");
      title.textContent = meal.strMeal;

      const img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.alt = meal.strMeal;

      // Badge element for category (will be filled asynchronously)
      const badge = document.createElement("span");
      badge.className = "category-badge";
      badge.textContent = ""; // initially empty
      badge.setAttribute("aria-hidden", "true");

      mealDiv.appendChild(badge);
      mealDiv.appendChild(title);
      mealDiv.appendChild(img);
      gridDiv.appendChild(mealDiv);

      // Fetch detailed info to populate the badge (non-blocking)
      (async function populateBadge(id, badgeEl) {
        try {
          const resp = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
          );
          const detail = await resp.json();
          if (detail && detail.meals && detail.meals[0]) {
            const cat = detail.meals[0].strCategory;
            if (cat) badgeEl.textContent = cat;
            else badgeEl.textContent = "";
          } else {
            // fallback to mock if available
            const mock = MOCK_DETAILS[id];
            if (mock && mock.strCategory)
              badgeEl.textContent = mock.strCategory;
          }
        } catch (err) {
          const mock = MOCK_DETAILS[id];
          if (mock && mock.strCategory) badgeEl.textContent = mock.strCategory;
        }
      })(meal.idMeal, badge);

      // click handler (fetch detail, fallback to MOCK_DETAILS, render + console.log)
      mealDiv.addEventListener("click", async () => {
        try {
          const detailResp = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const detailData = await detailResp.json();

          if (
            !detailData ||
            !detailData.meals ||
            detailData.meals.length === 0
          ) {
            const mock = MOCK_DETAILS[meal.idMeal];
            if (mock) {
              console.warn(
                `API returned no detail; using mock detail for id ${meal.idMeal}.`
              );
              console.log("Detailed meal info (mock):", mock);
              renderDetail(mock);
              return;
            } else {
              console.error(
                "API returned no detail and no mock available for id",
                meal.idMeal
              );
              return;
            }
          }

          console.log("Detailed meal info:", detailData.meals[0]);
          renderDetail(detailData.meals[0]);
        } catch (err) {
          const mock = MOCK_DETAILS[meal.idMeal];
          if (mock) {
            console.error(
              "Error fetching meal details; using mock data. Error:",
              err
            );
            console.log("Detailed meal info (mock):", mock);
            renderDetail(mock);
          } else {
            console.error(
              "Error fetching meal details and no mock available:",
              err
            );
          }
        }
      });
    });

    resultsDiv.appendChild(gridDiv);
  });
}

// NEW: combined fetch + render to support area OR category OR both
async function fetchAndRender(area, category) {
  const resultsDiv = document.getElementById("results");
  const detailDiv = document.getElementById("detail");
  resultsDiv.innerHTML = ""; // Clear previous results
  detailDiv.innerHTML = ""; // Clear previous detail

  // If nothing selected, do nothing
  if (!area && !category) return;

  try {
    if (area && category) {
      // Fetch both lists in parallel and compute intersection by idMeal
      const [areaResp, catResp] = await Promise.all([
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
            area
          )}`
        ),
        fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
            category
          )}`
        ),
      ]);
      const [areaData, catData] = await Promise.all([
        areaResp.json(),
        catResp.json(),
      ]);
      const areaMeals = areaData.meals || [];
      const catMeals = catData.meals || [];
      const areaIds = new Set(areaMeals.map((m) => m.idMeal));
      const intersect = catMeals.filter((m) => areaIds.has(m.idMeal));

      if (intersect.length) {
        renderMeals(intersect);
      } else {
        resultsDiv.textContent =
          "No meals found for this area + category combination.";
      }
    } else if (area) {
      // Only area selected
      const resp = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          area
        )}`
      );
      const data = await resp.json();
      if (data.meals) renderMeals(data.meals);
      else resultsDiv.textContent = "No meals found for this area.";
    } else {
      // Only category selected
      const resp = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          category
        )}`
      );
      const data = await resp.json();
      if (data.meals) renderMeals(data.meals);
      else resultsDiv.textContent = "No meals found for this category.";
    }
  } catch (err) {
    console.error("Error fetching meals:", err);
    resultsDiv.textContent = "Error fetching meals. See console for details.";
  }
}

// Replace separate change handlers with calls to fetchAndRender
document.getElementById("area-select").addEventListener("change", function () {
  const area = this.value;
  const category = document.getElementById("category-select").value;
  // do not clear category — allow combined filtering
  fetchAndRender(area, category);
});

document
  .getElementById("category-select")
  .addEventListener("change", function () {
    const category = this.value;
    const area = document.getElementById("area-select").value;
    // do not clear area — allow combined filtering
    fetchAndRender(area, category);
  });
