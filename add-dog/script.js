document.getElementById("addDogForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Hämta och dela upp användarens namn, för att endast behöva ett formulär för namn
  let fullName = document.getElementById("ownerName").value.split(" ");
  let firstName = fullName[0]; // Förnamn är den första delen
  let lastName = fullName.slice(1).join(" "); // Efternamn är resten
  let dogQuote = document.getElementById("dogQuote").value || "No quote provided";
  let randomImage = `https://placedog.net/400/200?random=${Math.floor(Math.random() * 1000)}`;

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
    quote: dogQuote,
    img: randomImage,
  };

  // Lagra den nya hunden i localStorage
  let savedDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
  savedDogs.push(newDog);
  localStorage.setItem("userDogs", JSON.stringify(savedDogs));

  // Navigera till sidan med hundarna
  window.location.href = "../main/index.html#bottom";
});
