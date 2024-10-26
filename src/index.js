let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");

  // Fetch all toys
  fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => renderToyCard(toy));
      });

  // Function to render a single toy card
  function renderToyCard(toy) {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      // Event listener for the like button
      card.querySelector(".like-btn").addEventListener("click", () => addLike(toy));
      
      toyCollection.appendChild(card);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".add-toy-form");

  form.addEventListener("submit", (event) => {
      event.preventDefault();
      
      const toyName = event.target.name.value;
      const toyImage = event.target.image.value;
      
      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: JSON.stringify({
              name: toyName,
              image: toyImage,
              likes: 0
          })
      })
      .then(response => response.json())
      .then(newToy => {
          renderToyCard(newToy);  // Reuse the function to render the new toy
      });
  });
});

function addLike(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
      // Update the likes in the DOM
      const toyCard = document.getElementById(updatedToy.id).closest(".card");
      toyCard.querySelector("p").innerText = `${updatedToy.likes} Likes`;
  });
}
