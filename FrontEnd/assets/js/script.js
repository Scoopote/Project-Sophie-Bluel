// Configuration de l'API
const API_BASE_URL = "http://localhost:5678/api";
const token = localStorage.getItem("token");
console.log("Token:", token);

// Récupération des travaux
async function getWorks() {
  const response = await fetch(`${API_BASE_URL}/works`);
  const works = await response.json();
  return works;
}

// Récupération des catégories
async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const categories = await response.json();
  return categories;
}

// Rendu de la galerie principale
async function displayWorks(selectedCategory = null) {
  const works = await getWorks();
  const gallery = document.getElementById("gallery");

  gallery.innerHTML = "";

  works.forEach((work) => {
    if (selectedCategory && work.categoryId !== selectedCategory.id) {
      return;
    }

    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Création des boutons de filtre
function createFilterButtons(categories) {
  const filtersContainer = document.getElementById("filters");

  const buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.classList.add("filter-button", "button-active");
  filtersContainer.appendChild(buttonAll);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");
    filtersContainer.appendChild(button);
  });
}

// Gestion des interactions sur les filtres
function setFilterButtonsActions(categories) {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      filterButtons.forEach((btn) => btn.classList.remove("button-active"));
      button.classList.add("button-active");

      const buttonText = event.target.textContent;

      if (buttonText === "Tous") {
        displayWorks();
      } else {
        const selectedCategory = categories.find(
          (category) => category.name === buttonText
        );
        displayWorks(selectedCategory);
      }
    });
  });
}

// Initialisation de la page
async function init() {
  const categories = await getCategories();

  if (!token) {
    createFilterButtons(categories);
    setFilterButtonsActions(categories);
  }

  displayWorks();
  headerLogged();
  initLogout();
  initModalEvents();
  galleryModal();
}

// Mise à jour de l'en-tête selon l'état d'authentification
function headerLogged() {
  const modeEdition = document.querySelector(".mode_edition");
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");
  const mesProjets = document.getElementById("MesProjets");

  if (token) {
    modeEdition.style.display = "block";
    login.style.display = "none";
    logout.style.display = "block";
    mesProjets.innerHTML =
      'Mes Projets<span class="projet_modif"><i class="fa-solid fa-pen-to-square"></i> Modifier</span>';
  } else {
    modeEdition.style.display = "none";
    login.style.display = "block";
    logout.style.display = "none";
  }
}

// Gestion de la déconnexion
function initLogout() {
  const logout = document.getElementById("logout");
  logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

// Rendu de la galerie dans la modale
async function galleryModal() {
  const gallery = document.getElementById("modal_content");
  gallery.innerHTML = "";

  const works = await getWorks();

  works.forEach((work) => {
    const div = document.createElement("div");
    div.classList.add("modal_item");
    div.style.backgroundImage = `url(${work.imageUrl})`;

    const trash = document.createElement("div");
    trash.classList.add("trash_color");
    trash.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    div.appendChild(trash);
    gallery.appendChild(div);
  });
}

// Ouverture de la modale
function openModal() {
  const modal = document.querySelector(".modale_gallery");
  const shad = document.getElementById("shad");

  modal.style.display = "block";
  shad.style.display = "block";
}

// Fermeture de la modale
function closeModal() {
  const modal = document.querySelector(".modale_gallery");
  const shad = document.getElementById("shad");

  modal.style.display = "none";
  shad.style.display = "none";
}

// Initialisation des événements de la modale
function initModalEvents() {
  const mesProjets = document.getElementById("MesProjets");
  const closeIcon = document.querySelector(".modale_close");
  const shad = document.getElementById("shad");

  mesProjets.addEventListener("click", () => {
    if (!token) return;
    openModal();
  });

  closeIcon.addEventListener("click", () => {
    closeModal();
  });

  shad.addEventListener("click", () => {
    closeModal();
  });
}

// Point d'entrée
init();
