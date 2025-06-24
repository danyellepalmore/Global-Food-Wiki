// Wait until the page is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    const dishInput = document.getElementById("dishInput");
    const resultBox = document.querySelector("div.border"); // Your output area
  
    // Function to fetch mock data and find the dish
    async function searchDish() {
      const query = dishInput.value.trim().toLowerCase();
      if (!query) return;
  
      try {
        const response = await fetch("mock-data.json");
        const data = await response.json();
  
        const match = data.find(
          (dish) => dish.name.toLowerCase() === query
        );
  
        if (match) {
          resultBox.innerHTML = `
            <h2 class="text-lg font-semibold mb-2">${match.name}</h2>
            <p><strong>Origin:</strong> ${match.origin}</p>
            <p><strong>Ingredients:</strong> ${match.ingredients.join(", ")}</p>
            <p><strong>Diet:</strong> ${match.diet}</p>
            <p><strong>Culture:</strong> ${match.culture}</p>
          `;
        } else {
          resultBox.innerHTML = `<p class="text-red-600">Sorry, dish not found in database.</p>`;
        }
      } catch (err) {
        resultBox.innerHTML = `<p class="text-red-600">Error loading data.</p>`;
        console.error("Fetch error:", err);
      }
    }
  
    // Run searchDish when user presses Enter in the text input
    dishInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        searchDish();
      }
    });
  });