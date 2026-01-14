
{/* <figure>
				<img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
				<figcaption>Abajour Tahina</figcaption>
			</figure> */}

async function displayWorks  ()  {
const works  = await fetch('http://localhost:5678/api/works',).then(response => response.json())

const galleryContainer = document.getElementById('gallery');

console.log(galleryContainer);

works.forEach(work => {
    // Créer un élément figure
    const figure = document.createElement('figure');
    // Créer un élément image
    const img = document.createElement('img');
    // Créer un élément figcaption
    const figcaption = document.createElement('figcaption');
    // Définir l'URL de l'image depuis les données du travail
    img.src = work.imageUrl;
    // Définir le texte alternatif de l'image
    img.alt = work.title;
    // Définir le texte de la légende
    figcaption.textContent = work.title;
    // Ajouter l'image au figure
    figure.appendChild(img);
    // Ajouter la légende au figure
    figure.appendChild(figcaption);
    // Ajouter le figure au conteneur de la galeriee
    galleryContainer.appendChild(figure);
});
    
}
displayWorks();