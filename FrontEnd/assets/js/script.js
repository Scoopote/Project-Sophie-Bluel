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

// Remplit la liste des catégories dans le formulaire de la modale
async function populateCategorySelect() {
  const select = document.getElementById("category");
  if (!select) return;

  select.innerHTML = "";

  const categories = await getCategories();

  const emptyOption = document.createElement("option");
emptyOption.style.color = "#6C6C6C";

  select.appendChild(emptyOption);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });


}

// Rendu de la galerie principale (liste complète)
async function displayWorks(selectedCategory = null) {
  const works = await getWorks();
  const gallery = document.getElementById("gallery");

  gallery.innerHTML = "";

  works.forEach((work) => {
    if (selectedCategory && work.categoryId !== selectedCategory.id) {
      return;
    }
    appendWorkToGallery(work);
  });
}

// Ajoute un travail à la galerie principale
function appendWorkToGallery(work) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = work.imageUrl;
  img.alt = work.title;
  figcaption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
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

// Ajoute un travail à la galerie de la modale
function appendWorkToModalGallery(work) {
  const gallery = document.getElementById("modal_content");
  if (!gallery) return;

  const div = document.createElement("div");
  div.classList.add("modal_item");
  div.style.backgroundImage = `url(${work.imageUrl})`;
  div.dataset.id = work.id;

  const trash = document.createElement("div");
  trash.classList.add("trash_color");
  trash.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  trash.addEventListener("click", async (event) => {
    event.stopPropagation();
    await deleteWork(work.id, div);
  });

  div.appendChild(trash);
  gallery.appendChild(div);
}

// Rendu de la galerie dans la modale (liste complète)
async function galleryModal() {
  const gallery = document.getElementById("modal_content");
  gallery.innerHTML = "";

  const works = await getWorks();

  works.forEach((work) => {
    appendWorkToModalGallery(work);
  });
}

// Bascule entre la vue galerie et la vue formulaire dans la modale
function showModalGalleryView() {
  const modalContent = document.getElementById("modal_content");
  const modalForm = document.getElementById("modal_form");
  const title = document.querySelector(".title_mod_gallery");
  const backIcon = document.querySelector(".modale_back");
  const addPhotoButton = document.getElementById("button_add_photo");

  title.textContent = "Galerie photo";
  modalContent.style.display = "flex";
  modalForm.style.display = "none";
  addPhotoButton.style.display = "block";
  backIcon.style.visibility = "hidden";
}

async function showModalFormView() {
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

  await populateCategorySelect();
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

  mesProjets.addEventListener("click", () => {
    if (!token) return;
    openModal();
    showModalGalleryView();
    galleryModal();
  });

  closeIcon.addEventListener("click", () => {
    closeModal();
  });

  shad.addEventListener("click", () => {
    closeModal();
  });

  addPhotoButton.addEventListener("click", () => {
    const button_validate = document.querySelector(".button_validate");
    if (button_validate) {
      button_validate.style.backgroundColor = "#A7A7A7";
    }
    showModalFormView();
  });

  backIcon.addEventListener("click", () => {
    showModalGalleryView();
  });
}

// Gestion de la prévisualisation de l'image dans la modale
function initImagePreview() {
  const fileInput = document.getElementById("image");
  const previewContainer = document.getElementById("modal_upload_preview");
  const uploadContent = document.querySelector(".modal_upload_content");

  if (!fileInput || !previewContainer || !uploadContent) return;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      previewContainer.innerHTML = "";
      const img = document.createElement("img");
      const button = document.querySelector(".button_validate"); 
      if (button) {
        button.style.backgroundColor = "#1d6154";
      }
      img.src = reader.result;
      previewContainer.appendChild(img);

      previewContainer.style.display = "flex";
      uploadContent.style.display = "none";
    });

    reader.readAsDataURL(file);
  });

  const uploadButton = document.querySelector(".button_upload");
  if (uploadButton) {
    uploadButton.addEventListener("click", () => {
      fileInput.click();
    });
  }
}

// Gestion de l'ajout d'un nouveau travail via le formulaire de la modale
function initModalFormSubmit() {
  const form = document.getElementById("modal_form");
  const fileInput = document.getElementById("image");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!token) {
      alert("Vous devez être connecté pour ajouter un projet.");
      return;
    }

    const file = fileInput.files[0];
    const title = titleInput.value.trim();
    const category = categorySelect.value;

    if (!file || !title || !category) {
      alert("Merci de remplir tous les champs et de sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    try {
      const response = await fetch(`${API_BASE_URL}/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        alert("L'ajout du projet a échoué.");
        return;
      }

      const newWork = await response.json();

      // Ajout dynamique dans les deux galeries
      appendWorkToGallery(newWork);
      appendWorkToModalGallery(newWork);

      // Réinitialisation du formulaire et de la preview
      form.reset();
      const previewContainer = document.getElementById("modal_upload_preview");
      const uploadContent = document.querySelector(".modal_upload_content");
      if (previewContainer && uploadContent) {
        previewContainer.innerHTML = "";
        previewContainer.style.display = "none";
        uploadContent.style.display = "flex";
      }

      // Retour à la vue galerie
      showModalGalleryView();
      alert("Le projet a été ajouté avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet :", error);
      alert("Une erreur réseau est survenue.");
    }
  });
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

    modalItemElement.remove();

    // Re-render complet de la galerie principale pour rester cohérent
    await displayWorks();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    alert("Une erreur réseau est survenue.");
  }
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
  initImagePreview();
  initModalFormSubmit();
}

init();
