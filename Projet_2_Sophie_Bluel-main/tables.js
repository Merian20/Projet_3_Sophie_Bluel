import { user } from "./user.js";
const endpoint = 'http://localhost:5678/api';

export function createTable(table) { //les works de la page d'accueil
    const gallery = document.getElementsByClassName("gallery")[0]; // dans le cas où rien n'est renvoyé
    if(table === undefined || table.length === 0) {
        gallery.innerHTML = "<div></div><h2>Il n'y a aucun élément à afficher dans la galerie.</h2>";
        return;
    };

    gallery.innerHTML = ''; // vide le contenu de modalBody

    table.forEach(element => { //création des images
        console.log(element);
        const figure = document.createElement("figure");
        const div  = document.createElement("div");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        img.src = element.imageUrl;
        img.alt = element.title;
        figcaption.innerText = element.title;

        div.appendChild(img);
        div.appendChild(figcaption)
        figure.appendChild(div);
        
        gallery.appendChild(figure);
    });
}

export function createModalTable(mesTravaux) {
    const modalBody = document.getElementsByClassName("modalBody")[0]; // dans le cas où rien n'est renvoyé
    if(mesTravaux === undefined || mesTravaux.length === 0) {
        modalBody.innerHTML = "<div></div><h2>Il n'y a aucun élément à afficher dans cette galerie.</h2>";
        return;
    };

    modalBody.innerHTML = ''; // vide le contenu de la modalBody

    mesTravaux.forEach((element, index) => { //création des images
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const deleteButtonIcon = document.createElement("button");
        const deleteIcon = document.createElement("i");

        img.src = element.imageUrl;
        img.alt = element.title;
        img.classList.add("modalImage");
        deleteIcon.classList.add("fa-solid", "fa-trash-can")
        deleteButtonIcon.classList.add("deleteButtonIcon")

        
        deleteButtonIcon.appendChild(deleteIcon);
        figure.appendChild(deleteButtonIcon);
        figure.appendChild(img);
       
        modalBody.appendChild(figure);
        //modalBody.appendChild(deleteButtonIcon);
     
        deleteButtonIcon.addEventListener('click', (event) => {
            deleteImage(element.id, index, mesTravaux);
        });
    });
}

async function deleteImage(id, index, mesTravaux) {
    console.log('image à supprimer', id, index);
    const params = {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
        },
    };

    try {
        const response = await fetch(`${endpoint}/works/${id}`, params);
        console.log(response);
        //return response.json();

        mesTravaux.splice(index, 1);

        createTable(mesTravaux);
        createModalTable(mesTravaux);
    } catch (error) {
        console.error('Erreur:', error);
        throw error; 
    }
}