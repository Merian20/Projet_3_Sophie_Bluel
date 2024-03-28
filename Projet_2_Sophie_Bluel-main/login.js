import { user } from "./user.js";
const endpoint = 'http://localhost:5678/api';

if(user && user.id && user.token) { //si l'utilisateur est déjà connecté et qu'il cherche à se reconnecter, sera redirigé vers l'index.html admin 
    window.location.href = './index.html';
}

// async function login(email, password) {
const login = async (email, password) => {
    const params = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    };

    const response = await fetch(endpoint + '/users/login/', params);

    if (!response.ok) {
        throw new Error(`Erreur lors de la connexion, e-mail ou mot de passe incorrect.\nVeuillez réessayer`);
    }

    return await response.json();
}

const form = document.getElementById("formulaire");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    let request;
    try {
        request = await login(email, password);
    } catch(error) {
        return alert(error.message);
    }
    
    const maintenant = new Date();
    const expiration = new Date();
    expiration.setTime(maintenant.getTime() + 31 * 24 * 60 * 60 * 1000);

    window.localStorage.setItem('user', JSON.stringify({
        id: request.userId,
        token: request.token,
        expiration: expiration.getTime(),
    }));

    window.location.href = './index.html';
});