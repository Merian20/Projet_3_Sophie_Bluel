import { user } from "./user.js";
import { createTable, createModalTable } from "./tables.js";

const endpoint = 'http://localhost:5678/api';
const uploadImageContainer = document.getElementById('upload-image-container');
const select = document.querySelector("select#categorie");
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const inputTitle = document.querySelector('.description input[type="text"]');
const btnValider = document.querySelector ('#addWorkModal input[type="submit"]');

function handleFiles(files) {
    if (!files) return;

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function() {
                const img = new Image();
                img.src = reader.result;
                uploadImageContainer.innerHTML = "";
                uploadImageContainer.appendChild(img);
            };

            reader.readAsDataURL(file);
        } else {
            alert('Veuillez sélectionner une image.');
        }
    }
    // console.log('end of handleFiles', files);
}

function checkValidity() {
    setTimeout(function () { //le temps d'upload l'image 
        const isImagePresent = uploadImageContainer.getElementsByTagName('img').length > 0;
        const isInputNoEmpty = inputTitle.value.trim() !== "";
        const isCategorySelect = select.value !== "";
    
        btnValider.disabled = !(isImagePresent && isInputNoEmpty && isCategorySelect);
    }, 50);
}

async function sendNewWork(image, mesTravaux) {
    const sendWorkFormData = new FormData();
    sendWorkFormData.append("image", image.image);
    sendWorkFormData.append("title", image.title);
    sendWorkFormData.append("category", image.category.id);
    //console.log(user.token);
    const params = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${user.token}`,
        },
        body: sendWorkFormData,
    };
    const response = await fetch(endpoint + '/works/', params);

    if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi de l'image.\nVeuillez réessayer`);
    }

    const data = await response.json();
    mesTravaux.push(data);

    createTable(mesTravaux);
    createModalTable(mesTravaux);
}
    
function clearDropzone() {
    const uploadImageContainer = document.getElementById('upload-image-container');
    uploadImageContainer.innerHTML = '';
    inputTitle.value = '';
    select.value = '';

    btnValider.style.backgroundColor = '#A7A7A7';
    btnValider.disabled = true;
}

function initDropzone() {
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
        checkValidity();
    });

    dropzone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropzone.classList.add('dragover');

    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropzone.classList.remove('dragover');
        handleFiles(event.dataTransfer.files);
        checkValidity();
    });
}

export async function gestionDropZone(categories, mesTravaux) {
    try {
        categories.forEach(category => {
        const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;

            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }

    initDropzone();

    inputTitle.addEventListener('input', checkValidity);
    select.addEventListener('input', checkValidity);

    btnValider.addEventListener('click', () => {
        const file = fileInput.files[0]; //si plusieurs fichiers sont envoyés, ne récupère que le premier
        if (file) { //n'est pas null
            const reader = new FileReader();
            console.log(file);
    
            reader.onload = function () {
                const newImage = {
                    imageUrl: reader.result,
                    image: file,
                    title: inputTitle.value.trim(),
                    category: {
                        id: select.value,
                        name: select.options[select.selectedIndex].text,
                    }
                };

                sendNewWork(newImage, mesTravaux);
                
                clearDropzone();
            };
            reader.readAsDataURL(file);
        }
    });
};