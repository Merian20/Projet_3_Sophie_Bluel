export const user = JSON.parse(localStorage.getItem('user'));

const now = new Date();
const expirationDate = new Date(user?.expiration); //test si le user existe et récupère son expiration

if (now.getTime() > expirationDate.getTime()) {
    // L'heure d'expiration est dépassée, déconnecter l'utilisateur
    console.log("Suppression de l'identifiant de connexion");
    window.localStorage.removeItem('user');
    window.location.reload();
}