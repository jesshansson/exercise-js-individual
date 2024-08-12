API_URL = "https://majazocom.github.io/Data/dogs.json";

//apiDogs: Här sparas endast de första 10 hundarna från API
//userDogs: Här sparas de hundar som användaren lägger till via formuläret.
//Vid sidladdning (DOMContentLoaded) laddas hundarna från både apiDogs och userDogs och visas tillsammans.
//När en ny hund läggs till, uppdateras endast userDogs, och kombinerade listan visas igen.
//När sidan laddas kommer den bara att visa de 10 första API-hundarna plus eventuellt tillagda hundar, inte hela API-listan.
//displayDogs(allDogs): Visar alla hundar, både de som hämtas från API och de som läggs till av användaren.

async function fetchDogs() {
  try {
    let response = await fetch(API_URL); // Hämta data från API:et
    let data = await response.json(); // Konvertera svaret till JSON

    // Begränsa antalet hundar som visas från API:et
    let limitedDogs = data.slice(0, 10);

    // Spara datan(begränsat antal från API) i localStorage som en sträng
    localStorage.setItem("apiDogs", JSON.stringify(limitedDogs));

    // Kolla om det finns fler hundar i localStorage och lägg till dem
    let savedDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
    let allDogs = limitedDogs.concat(savedDogs); //"concat" används för att kombinera de begränsade hundarna från API med de hundar som redan finns i localStorage (de som du har lagt till manuellt).

    displayDogs(allDogs); // Anropa funktionen för att visa hundarna på sidan
  } catch (error) {
    console.error("Error fetching data:", error); // Fånga och logga eventuella fel
    document.getElementById("error-message").textContent =
      "Failed to load dogs. Please try again later.";
  }
}

//Funktionen som anropas i fetchDogs, för att visa hundarna
function displayDogs(dogs) {
  const dogsList = document.getElementById("dogs-list"); // Hämta elementet där listan ska visas
  dogsList.innerHTML = ""; // Rensa listan innan uppdatering

  dogs.forEach((dog, index) => {
    let dogDiv = document.createElement("div"); // Skapa en ny div för varje hund
    dogDiv.classList.add("dog-info"); // Lägg till en klass för CSS-styling

    // Skapa ett element för hundens namn
    let nameElement = document.createElement("h3");
    nameElement.textContent = dog.name;

    // Skapa ett element för hundens bild
    let imgElement = document.createElement("img");
    imgElement.src = dog.img || "https://placedog.net/400x200";
    imgElement.alt = dog.name;
    imgElement.style.width = "300px";

    // Skapa ett element för hundens ras
    let breedElement = document.createElement("p");
    breedElement.textContent = `Breed: ${dog.breed}`;

    // Skapa ett element för hundens ålder
    let ageElement = document.createElement("p");
    ageElement.textContent = `Age: ${dog.age}`;

    //Skapa element för ögarens info
    let ownerName = document.createElement("p");
    let fullOwnerName = `${dog.owner.name} ${dog.owner.lastName || ""}`.trim(); // Lägg till efternamn om det finns
    ownerName.textContent = `Owner: ${fullOwnerName}`;

    let ownerPhone = document.createElement("p");
    ownerPhone.textContent = `Phone: ${dog.owner.phoneNumber}`;

    //Skapa delete-knapp
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteDog(index);
    };

    // Lägg till alla element i hund-diven
    dogDiv.appendChild(nameElement);
    dogDiv.appendChild(imgElement);
    dogDiv.appendChild(breedElement);
    dogDiv.appendChild(ageElement);
    dogDiv.appendChild(ownerName);
    dogDiv.appendChild(ownerPhone);
    dogDiv.appendChild(deleteButton);

    // Lägg till hund-diven i huvudlistan
    dogsList.appendChild(dogDiv);
  });
}

function deleteDog(index) {
  let savedDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
  let apiDogs = JSON.parse(localStorage.getItem("apiDogs")) || [];

  // Avgör om hunden tillhör användartillagda hundar eller API-hundar och ta bort rätt hund
  if (index < apiDogs.length) {
    apiDogs.splice(index, 1); // Ta bort från API-hundarna
    localStorage.setItem("apiDogs", JSON.stringify(apiDogs)); // Uppdatera localStorage
  } else {
    savedDogs.splice(index - apiDogs.length, 1); // Ta bort från användares tilllagda hundar
    localStorage.setItem("userDogs", JSON.stringify(savedDogs)); // Uppdatera localStorage
  }

  // Uppdatera visningen efter radering
  displayDogs(apiDogs.concat(savedDogs));
}

fetchDogs();
