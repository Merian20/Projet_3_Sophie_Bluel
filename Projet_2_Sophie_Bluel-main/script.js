import { createTable, createModalTable } from "./tables.js";
import { gestionDropZone } from "./addImage.js";
import { user } from "./user.js";

const endpoint = 'http://localhost:5678/api';

export async function callAPI(route) {
    const params = {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    };

    try {
        const response = await fetch(`${endpoint}/${route}`, params)
        return response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error; // Relance l'erreur pour que le code l'appelant puisse la gérer
    }
}

let mesTravaux = [];
async function main() { //récupération des travaux/works
    try {
        mesTravaux = await callAPI('works')
    } catch (error) {
        console.log(error);
    }
    // console.log("Mes travaux :", mesTravaux);

    createTable(mesTravaux);    

    let categories = []; //récupération des catégories
    try {
        categories = await callAPI('categories');
    } catch(error) {
        console.log(error);
    }
    // console.log("Les catégories :", categories);

    gestionDropZone(categories, mesTravaux);

    const filters = document.getElementsByClassName("button_filter")[0];

    if(user && user.id && user.token) return;

    categories.unshift({id: null, name: 'Tous'}); //unshift = mettre un élément au début du containerau

    categories.forEach(category => { //création des boutons
        const button = document.createElement("button");

        button.innerText = category.name;
        
        filters.appendChild(button);

        button.addEventListener("click", (event) => {
            // console.log(`Catégorie ${category.id} filtrée`);
            button.classList.toggle("selected"); //la class selected sera ajouté quand le bouton sélectionné
            filters.querySelectorAll("button.selected").forEach(btn => { // chaque boutton sera mis à son tour dans btn
                // pour chaque bouton de la boucle, teste si il est le bouton cliqué ou non
                if(button !== btn) {
                    btn.classList.remove("selected");
                };
            });
            if(category.id !== null && button.classList.contains("selected")) {
                createTable(mesTravaux.filter(travail => travail.categoryId == category.id));
                //console.log(category);
            } else {
                createTable(mesTravaux);
            };
        });
    });
};

main();

export function closeModal(event) {
    event.srcElement.parentNode.parentNode.parentNode.classList.add("hidden");
};

export function closeEveryModal() {
    for(const modal of document.getElementsByClassName('modalContainer')) {
        modal.classList.add('hidden');
    };
};

function editAmin () {
    // console.log("user", user);
    // console.log((user && user.id && user.token));

    if(!user || !user.id || !user.token) return;



    const body = document.getElementsByTagName("body")[0];
    
    const editionMode = document.getElementsByClassName("editionMode")[0];
    const icon = document.createElement("i");
    const button = document.createElement ("button");

    icon.classList.add("far", "fa-pen-to-square");
    //button.innerText = "Mode édition";
    
    button.appendChild(icon);
    button.appendChild(document.createTextNode("Mode édition"));
    editionMode.appendChild(button);

    body.appendChild(editionMode);

    body.insertBefore(editionMode, body.firstChild); //encart noir edition mode

    const projets = document.getElementsByClassName("projets")[0];
    const openModalBtn = document.createElement("span");
    const iconModify = document.createElement("i");
    
    iconModify.classList.add("far", "fa-pen-to-square")
    openModalBtn.classList.add("modifier")
    //p.innerText = "modifier";

    openModalBtn.appendChild(iconModify);
    openModalBtn.appendChild(document.createTextNode("modifier"));
    
    projets.appendChild(openModalBtn); //bouton modifier

    const modal = document.getElementById("mainModal");

    const openWorkModalBtn = modal.querySelector("input[type=submit]");  //bouton ajouter une photo
    openWorkModalBtn.addEventListener('click', () => {
        document.getElementById("addWorkModal").classList.toggle("hidden");
    });

    const toggleModal = () => {
        modal.classList.toggle("hidden");
    }

    openModalBtn.addEventListener("click", (event) => {
        toggleModal();
        createModalTable(mesTravaux);
    });

    document.addEventListener('keydown', (event) => {
        if(modal.classList.contains("hidden")) return;
        if(event.key === "Escape") toggleModal();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) toggleModal();
    });

    const buttonLogin = document.getElementById('button-login');
    buttonLogin.innerText = '';
    const logoutButton = document.createElement('p');
    logoutButton.innerText = 'logout';
    buttonLogin.appendChild(logoutButton);

    logoutButton.addEventListener('click', (event) => {
        window.localStorage.removeItem('user');
        window.location.reload();
        event.preventDefault();
        }); 
}
editAmin();