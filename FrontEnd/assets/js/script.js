const modulePattern = {
 // Initialiser le module en affichant les filtres et les travaux
 init(){
    modulePattern.displayFilters();
    modulePattern.displayWorks();
 },

 // Fonction asynchrone pour afficher les travaux
 async displayWorks(category) {
     // Récupérer les données des travaux depuis l'API
     const works = await fetch('http://localhost:5678/api/works',).then(response => response.json())

     // Récupérer le conteneur de la galerie
     const galleryContainer = document.getElementById('gallery');

     // Parcourir chaque travail
     works.forEach(work => {
          // Vérifier si une catégorie est sélectionnée et si le travail appartient à cette catégorie
          if(category && work.categoryId === category.id){
                // Créer les éléments HTML pour afficher le travail
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const figcaption = document.createElement('figcaption');
                // Définir les attributs de l'image
                img.src = work.imageUrl;
                img.alt = work.title;
                // Définir le texte de la légende
                figcaption.textContent = work.title;
                // Assembler les éléments et ajouter au DOM
                figure.appendChild(img);
                figure.appendChild(figcaption);
                galleryContainer.appendChild(figure);
          // Si aucune catégorie n'est sélectionnée, afficher tous les travaux
          } else if (!category){
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const figcaption = document.createElement('figcaption');
                img.src = work.imageUrl;
                img.alt = work.title;
                figcaption.textContent = work.title;
                figure.appendChild(img);
                figure.appendChild(figcaption);
                galleryContainer.appendChild(figure);
          }
     });
 },

 // Fonction asynchrone pour afficher les boutons de filtre
 async displayFilters(){
     // Récupérer les catégories depuis l'API
     const categories = await fetch('http://localhost:5678/api/categories').then(response => response.json())

     // Créer les boutons de filtre
     function createFilterButtons() {
          const filtersContainer = document.getElementById('filters');
          // Créer le bouton "Tous"
          const buttonAll = document.createElement('button');
          buttonAll.textContent = 'Tous';
          buttonAll.classList.add('filter-button', 'button-active');
          filtersContainer.appendChild(buttonAll);

          // Créer un bouton pour chaque catégorie
          categories.forEach(category => {
            // bouton créé
                const button = document.createElement('button');
                // Définir le texte et la classe du bouton
                button.textContent = category.name;
                button.classList.add('filter-button');
                filtersContainer.appendChild(button);
          });
     }

     // Gérer les clics sur les boutons de filtre
     function actionButtonsFilters(){
          const filterButtons = document.querySelectorAll('.filter-button');

          filterButtons.forEach(button => {
                button.addEventListener("click", (event)=>{
                     // Activer le bouton cliqué et désactiver les autres
                     button.classList.add("button-active");
                    //  Désactiver les autres boutons
                     filterButtons.forEach(otherButton => {
                          if (otherButton !== button){
                            // Désactiver les autres boutons
                                otherButton.classList.remove('button-active');
                          }
                     });

                     // Vider la galerie pour recharger les travaux
                     const galleryContainer = document.getElementById('gallery');
                     galleryContainer.innerHTML = '';
                     // Récupérer le texte du bouton cliqué
                     const buttonText = event.target.textContent;

                     // Afficher tous les travaux ou filtrer par catégorie
                     if (buttonText === 'Tous'){
                          modulePattern.displayWorks();
                     } else {
                        // Trouver la catégorie correspondant au bouton cliqué
                          const selectedCategory = categories.find(category => category.name === buttonText);
                        //   Afficher les travaux de la catégorie sélectionnée
                          modulePattern.displayWorks(selectedCategory);
                     }
                })
          })
     }

     // Exécuter les fonctions
     createFilterButtons();
     actionButtonsFilters();
 }
}

// Initialiser le module
modulePattern.init();
const token = localStorage.getItem("token");
console.log ("Token:", token);