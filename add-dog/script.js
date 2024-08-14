document.getElementById("addDogForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Hämta och dela upp användarens namn, för att endast behöva ett formulär för namn
  let fullName = document.getElementById("ownerName").value.split(" ");
  let firstName = fullName[0]; // Förnamn är den första delen
  let lastName = fullName.slice(1).join(" "); // Efternamn är resten

  // Skapa ett nytt hundobjekt
  let newDog = {
    name: document.getElementById("dogName").value,
    breed: document.getElementById("dogBreed").value,
    age: document.getElementById("dogAge").value,
    owner: {
      name: firstName,
      lastName: lastName,
      phoneNumber: document.getElementById("ownerPhone").value,
    },
  };

  // Lagra den nya hunden i localStorage
  let savedDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
  savedDogs.push(newDog);
  localStorage.setItem("userDogs", JSON.stringify(savedDogs));

  window.location.href = "../main/index.html";
});
