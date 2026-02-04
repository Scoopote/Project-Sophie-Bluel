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

// Bascule entre la vue galerie et la vue formulaire dans la modale
function showModalGalleryView() {
  const modalContent = document.getElementById("modal_content");
  const modalForm = document.getElementById("modal_form");
  const title = document.querySelector(".title_mod_gallery");
  const backIcon = document.querySelector(".modale_back");
  const addPhotoButton = document.getElementById("button_add_photo");

  title.textContent = "Gallerie photo";
  modalContent.style.display = "flex";
  modalForm.style.display = "none";
  addPhotoButton.style.display = "block";
  backIcon.style.visibility = "hidden";
}

function showModalFormView() {
  const modalContent = document.getElementById("modal_content");
  const modalForm = document.getElementById("modal_form");
  const title = document.querySelector(".title_mod_gallery");
  const backIcon = document.querySelector(".modale_back");
  const addPhotoButton = document.getElementById("button_add_photo");

  title.textContent = "Ajout photo";
  modalContent.style.display = "none";
  modalForm.style.display = "flex";
  addPhotoButton.style.display = "none";
  backIcon.style.visibility = "visible";
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
  const backIcon = document.querySelector(".modale_back");
  const addPhotoButton = document.getElementById("button_add_photo");

  // Ouvrir au clic sur "Mes Projets Modifier"
  mesProjets.addEventListener("click", () => {
    if (!token) return;
    openModal();
    showModalGalleryView(); // toujours ouvrir sur la vue galerie
  });

  // Fermer au clic sur la croix
  closeIcon.addEventListener("click", () => {
    closeModal();
  });

  // Fermer au clic sur le fond sombre
  shad.addEventListener("click", () => {
    closeModal();
  });

  // Afficher la vue formulaire au clic sur "Ajouter une photo"
  addPhotoButton.addEventListener("click", () => {
    showModalFormView();
  });

  // Retour à la vue galerie au clic sur la flèche
  backIcon.addEventListener("click", () => {
    showModalGalleryView();
  });

  // Rendu de la galerie dans la modale
async function galleryModal() {
  const gallery = document.getElementById("modal_content");
  gallery.innerHTML = "";

  const works = await getWorks();

  works.forEach((work) => {
    const div = document.createElement("div");
    div.classList.add("modal_item");
    div.style.backgroundImage = `url(${work.imageUrl})`;
    div.dataset.id = work.id; // on garde l'id du projet

    const trash = document.createElement("div");
    trash.classList.add("trash_color");
    trash.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // clic sur la poubelle = suppression du travail
    trash.addEventListener("click", async (event) => {
      event.stopPropagation(); // évite des clics parasites
      await deleteWork(work.id, div);
    });

    div.appendChild(trash);
    gallery.appendChild(div);
  });
}

}

// Suppression d'un travail via l'API + mise à jour du DOM
async function deleteWork(workId, modalItemElement) {
  if (!token) {
    alert("Vous devez être connecté pour supprimer un projet.");
    return;
  }

  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce projet ?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_BASE_URL}/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("La suppression a échoué.");
      return;
    }

    // 1) Retirer l'élément de la modale
    modalItemElement.remove();

    // 2) Rafraîchir la galerie principale sans recharger la page
    await displayWorks();

  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    alert("Une erreur réseau est survenue.");
  }
}


// Point d'entrée
init();
