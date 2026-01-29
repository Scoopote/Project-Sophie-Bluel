// URL de base de l'API
const API_BASE_URL = "http://localhost:5678/api";
const token = localStorage.getItem("token");
console.log("Token:", token);
// Fonction pour récupérer les travaux
async function getWorks() {
  const response = await fetch(`${API_BASE_URL}/works`);
  const works = await response.json();
  return works;
}

// Fonction pour récupérer les catégories
async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const categories = await response.json();
  return categories;
}

// Affiche la liste des travaux dans la galerie
async function displayWorks(selectedCategory = null) {
  const works = await getWorks();
  const gallery = document.getElementById("gallery");

  // On vide la galerie avant de rajouter les éléments
  gallery.innerHTML = "";

  works.forEach((work) => {
    // Si une catégorie est sélectionnée, on filtre
    if (selectedCategory && work.categoryId !== selectedCategory.id) {
      return; // on passe au travail suivant
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

// Crée les boutons de filtre
function createFilterButtons(categories) {
  const filtersContainer = document.getElementById("filters");

  // Bouton "Tous"
  const buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.classList.add("filter-button", "button-active");
  filtersContainer.appendChild(buttonAll);

  // Boutons pour chaque catégorie
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-button");
    filtersContainer.appendChild(button);
  });
}

// Gère les clics sur les boutons de filtre
function setFilterButtonsActions(categories) {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Gestion de l'état actif
      filterButtons.forEach((btn) => btn.classList.remove("button-active"));
      button.classList.add("button-active");

      // Texte du bouton cliqué
      const buttonText = event.target.textContent;

      // Tous les travaux
      if (buttonText === "Tous") {
        displayWorks();
      } else {
        // On trouve la catégorie correspondant au bouton
        const selectedCategory = categories.find(
          (category) => category.name === buttonText
        );
        displayWorks(selectedCategory);
      }
    });
  });
}



// Initialise les filtres et affiche les travaux
async function init() {
  const categories = await getCategories();
  if (!token){
  createFilterButtons(categories);}
  setFilterButtonsActions(categories);
  displayWorks();
}

// Lancement du script
init();


function headerLogged(){
const modeEdition = document.querySelector(".mode_edition");
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const mesProjets = document.getElementById("MesProjets");
  if (token) {
modeEdition.style.display = "block";
login.style.display = "none";
logout.style.display = "block";
mesProjets.innerHTML='Mes Projets<span class="projet_modif"><i class="fa-solid fa-pen-to-square"></i> Modifier</span>'

  }
    
}
headerLogged();
function logout (){
  const logout = document.getElementById("logout");
  logout.addEventListener("click", function(){
    localStorage.removeItem("token");
    window.location.href="index.html";
  });

}
logout();

async function galleryModal(){
    const gallery = document.getElementById("modal_content");
    console.log(gallery);
    const works = await getWorks();

    works.forEach((work) => {
    const div = document.createElement("div");
    div.innerHTML='<div class="trash_color"><i class="fa-solid fa-trash-can"></i></div>'
    div.style.backgroundImage = `url(${work.imageUrl})`;
    div.classList.add("modal_item");
    gallery.appendChild(div);
  });
}

galleryModal()


