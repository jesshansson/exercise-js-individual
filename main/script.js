API_URL = "https://majazocom.github.io/Data/dogs.json";

//apiDogs: Här sparas endast de första 10 hundarna från API
//userDogs: Här sparas de hundar som användaren lägger till via formuläret.
//Vid sidladdning (DOMContentLoaded) laddas hundarna från både apiDogs och userDogs och visas tillsammans.
//När en ny hund läggs till, uppdateras endast userDogs, och kombinerade listan visas igen.
//När sidan laddas kommer den bara att visa de 12 första API-hundarna plus eventuellt tillagda hundar, inte hela API-listan.
//displayDogs(allDogs): Visar alla hundar, både de som hämtas från API och de som läggs till av användaren.

async function fetchDogs() {
  try {
    let response = await fetch(API_URL); // Hämta data från API:et
    let data = await response.json(); // Konvertera svaret till JSON

    // Begränsa antalet hundar som visas från API:et
    let limitedDogs = data.slice(0, 12);

    // Spara datan (begränsat antal från API) i localStorage som en sträng
    localStorage.setItem("apiDogs", JSON.stringify(limitedDogs));

    // Kolla om det finns fler hundar i localStorage och lägg till dem
    let savedDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
    let allDogs = limitedDogs.concat(savedDogs); //"concat" används för att kombinera de begränsade hundarna från API med de hundar som redan finns i localStorage (de som har lagts till manuellt).

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
    dogDiv.classList.add("dog-info"); // Klass för CSS-styling

    // Hundens namn
    let nameElement = document.createElement("h3");
    nameElement.textContent = dog.name;

    // Hundens bild
    let imgElement = document.createElement("img");
    imgElement.src = dog.img || "https://placedog.net/400x200";
    imgElement.alt = dog.name;

    // Hundens ras
    let breedElement = document.createElement("p");
    breedElement.textContent = `Breed: ${dog.breed}`;

    // Hundens ålder
    let ageElement = document.createElement("p");
    ageElement.textContent = `Age: ${dog.age}`;

    // Ägarens info
    let ownerName = document.createElement("p");
    let fullOwnerName = `${dog.owner.name} ${dog.owner.lastName || ""}`.trim(); // Lägg till efternamn om det finns
    ownerName.textContent = `Owner: ${fullOwnerName}`;

    let ownerPhone = document.createElement("p");
    ownerPhone.textContent = `Phone: ${dog.owner.phoneNumber}`;

    // Update-knapp
    let updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.onclick = function () {
      showUpdateForm(index);
    };
    // Dlete-knapp
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
    dogDiv.appendChild(updateButton);
    dogDiv.appendChild(deleteButton);

    // Lägg till hund-diven i huvudlistan
    dogsList.appendChild(dogDiv);
  });
}

function deleteDog(index) {
  let savedDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
  let apiDogs = JSON.parse(localStorage.getItem("apiDogs")) || [];

  // Avgör om hunden tillhör användartillagda hundar eller API-hundar och ta bort rätt hund (API-hundarna är först i listan.)
  if (index < apiDogs.length) {
    // Ta bort från API-hundarna
    apiDogs.splice(index, 1);
    localStorage.setItem("apiDogs", JSON.stringify(apiDogs)); // Uppdatera localStorage
  } else {
    // Ta bort från användares tilllagda hundar
    savedDogs.splice(index - apiDogs.length, 1);
    localStorage.setItem("userDogs", JSON.stringify(savedDogs)); // Uppdatera localStorage
  }

  // Uppdatera visningen efter radering
  displayDogs(apiDogs.concat(savedDogs));
}

function showUpdateForm(index) {
  let apiDogs = JSON.parse(localStorage.getItem("apiDogs")) || [];
  let userDogs = JSON.parse(localStorage.getItem("userDogs")) || [];
  let dogs, dog; // Dessa variabler används i funktionen för att hålla referenser till den array där den aktuella hunden (dog) finns, och själva hundobjektet som ska uppdateras.
  //"dogs" används för att referera till antingen apiDogs eller userDogs beroende på var den aktuella hunden finns.

  // Kontrollera om hunden tillhör API-datan eller användarens data
  if (index < apiDogs.length) {
    //Om detta är sant betyder det att hunden som vi vill uppdatera finns i apiDogs-arrayen.
    dogs = apiDogs; //Hundar som kommer från API
    dog = dogs[index];
  } else {
    //Om index är större än eller lika med längden på apiDogs, betyder det att den hund vi vill uppdatera finns i userDogs-arrayen.
    dogs = userDogs; //Hundar som användaren har lagt till
    dog = dogs[index - apiDogs.length]; //Hundarna i savedDogs börjar inte på index 0 i den sammanslagna listan, utan efter alla hundar från API. Därför måste vi subtrahera apiDogs.length från index för att få rätt position i savedDogs.
  }

  if (!dog) {
    console.error("Could not find the dog with the given index:", index);
    return;
  }

  // Formulär för att uppdatera informationen
  const updateForm = `
    <form id="updateDogForm">
      <label for="updateDogName">Dog name:</label>
      <input type="text" id="updateDogName" name="updateDogName" value="${dog.name}" required />

      <label for="updateDogBreed">Breed:</label>
      <input type="text" id="updateDogBreed" name="updateDogBreed" value="${dog.breed}" required />

       <label for="updateDogAge">Age:</label>
            <input type="number" id="updateDogAge" name="updateDogAge" value="${dog.age}" required />

            <label for="updateOwnerName">Owner Name:</label>
            <input type="text" id="updateOwnerName" name="updateOwnerName" value="${dog.owner.name} ${dog.owner.lastName}" required />

            <label for="updateOwnerPhone">Owner Phone:</label>
            <input type="text" id="updateOwnerPhone" name="updateOwnerPhone" value="${dog.owner.phoneNumber}" required />

            <button type="submit">Update Info</button>
        </form>
    `;

  const updateSection = document.getElementById("update-section");
  updateSection.innerHTML = updateForm;

  updateSection.scrollIntoView({ behavior: "smooth" });

  document.getElementById("updateDogForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Uppdatera hundens information
    dog.name = document.getElementById("updateDogName").value;
    dog.breed = document.getElementById("updateDogBreed").value;
    dog.age = document.getElementById("updateDogAge").value;

    let fullName = document.getElementById("updateOwnerName").value.split(" ");
    dog.owner.name = fullName[0];
    dog.owner.lastName = fullName.slice(1).join(" ");

    dog.owner.phoneNumber = document.getElementById("updateOwnerPhone").value;

    // Spara uppdateringen i localStorage
    if (index < JSON.parse(localStorage.getItem("apiDogs")).length) {
      // Om indexet tillhör apiDogs
      localStorage.setItem("apiDogs", JSON.stringify(dogs));
    } else {
      // Om indexet tillhör userDogs
      localStorage.setItem("userDogs", JSON.stringify(dogs));
    }

    // Uppdatera visningen
    displayDogs(
      JSON.parse(localStorage.getItem("apiDogs")).concat(
        JSON.parse(localStorage.getItem("userDogs"))
      )
    );

    // Ta bort uppdateringsformuläret efter uppdateringen
    updateSection.innerHTML = "";
  });
}

fetchDogs();
