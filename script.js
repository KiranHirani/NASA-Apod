// NASA API
const apiKey = "eChEDlwtiCfxqn4XyVQYJWcD2aMkG6coa6q5f9Qy";
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Selecting DOM Elements
const resultsNav = document.getElementById("resultsNav"),
  favoritesNav = document.getElementById("favouritesNav"),
  imagesContainer = document.querySelector(".images-container"),
  saveConfirmed = document.querySelector(".save-confirmed"),
  loader = document.querySelector(".loader");

let resultsArray = [];
let favorites = {};

function createDOMNodes(isFavorite) {
  const array = isFavorite ? Object.values(favorites) : resultsArray;
  array.forEach((object) => {
    //   Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    //   Link
    const link = document.createElement("a");
    link.href = object.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = object.url;
    image.alt = "NASA Picture of the day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = object.title;
    // Favourites
    const fav = document.createElement("p");
    fav.classList.add("clickable");
    if (!isFavorite) {
      fav.textContent = "Add To Favourites";
      fav.setAttribute("onclick", `saveFavorite('${object.url}')`);
    } else {
      fav.textContent = "Remove Favorite";
      fav.setAttribute("onclick", `removeFavorite('${object.url}')`);
    }

    // Description
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = object.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date in Footer
    const date = document.createElement("strong");
    date.textContent = object.date;
    // Copyright Info
    const copyrightResult =
      object.copyright === undefined ? "" : object.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = `${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, fav, cardText, footer);

    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(isFavorite) {
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(isFavorite);
  showContent(isFavorite);
}

function showContent(isFavorite) {
  window.scrollTo({ top: 0, behavior: "instant" });

  if (!isFavorite) {
    favoritesNav.classList.add("hidden");
    resultsNav.classList.remove("hidden");
  } else {
    favoritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
  }

  loader.classList.add("hidden");
}

function saveFavorite(url) {
  //   If favorite already has the key, we won't add it
  if (!favorites[url]) {
    const favouritePost = resultsArray.find((object) => object.url === url);
    favorites[url] = { ...favouritePost };
    saveInLocalStorage();
    //   Show Save confirmation
    saveConfirmed.hidden = false;
    setTimeout(() => {
      saveConfirmed.hidden = true;
    }, 2000);
  }
}

function removeFavorite(url) {
  if (favorites[url]) {
    delete favorites[url];
    saveInLocalStorage();
    updateDOM(true);
  }
}

function saveInLocalStorage() {
  localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
}

// Get 10 images from NASA API
async function getDataFromAPI() {
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    // resultsArray = apodArray;
    updateDOM(false);
  } catch (error) {
    console.log(error);
  }
}

getDataFromAPI();

// Event Listeners
