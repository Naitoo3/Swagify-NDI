import liensTab from "./rules.js";

let isBlockingEnabled = localStorage.getItem('isBlockingEnabled') === 'false' ? false : true;

// Déclaration de CookieBlocked en dehors des fonctions pour pouvoir y accéder dans UpdateCounter
let CookieBlocked = 0;


async function getCurrentURL() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab || !tab.url) { 
        return null;
    }
    return tab.url;
}

async function handleTabChange() {
    const currentURL = await getCurrentURL();
    console.log("Tab changed, current URL: ", currentURL);
    // Exécuter le blocage des cookies lors du changement/mise à jour de l'onglet
    await BlocageCookie(); 
    UpdateCounter(); // Mettre à jour le compteur après le blocage
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    await handleTabChange();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // S'assurer que la fonction BlocageCookie est appelée uniquement une fois le chargement complet de l'onglet actif
    if (changeInfo.status === 'complete' && tab.active) {
        await handleTabChange();
    }
});

// --- Gestion de la liste blanche ---
function loadWhitelist() {
    return liensTab; // le tableau importé
} 

// --- Fonction de Blocage des Cookies (CONDITIONNÉE PAR L'ÉTAT) ---
async function BlocageCookie() {
    // VÉRIFICATION DE L'ÉTAT DU BOUTON : Si le blocage est désactivé, on sort.
    if (!isBlockingEnabled) {
        console.log("Le blocage est désactivé par l'utilisateur.");
        return 0;
    }

    const liens = await getCurrentURL();
    const whitelist = loadWhitelist();
    let currentBlockedCount = 0; // Compteur pour cette exécution

    if (!liens || !whitelist || whitelist.length === 0) {
        return 0;
    }

    // Le but de votre boucle est de vérifier si le lien actuel correspond à une règle
    // Si la page actuelle fait partie d'une whitelist/blacklist (selon votre 'rules.js')
    // Le code suivant semble vouloir dire: si la page N'EST PAS dans la whitelist, alors on bloque. 
    // J'ai besoin de clarifier votre logique de 'rules.js'. En attendant, je simule la logique:
    
    // Supposons que liensTab (whitelist) contient les URLs OÙ NE PAS BLOQUER.
    // Si le lien actuel n'est PAS dans la whitelist, alors on bloque tout sur cette URL.
    if (!whitelist.includes(liens)) {

        chrome.cookies.getAll({ url: liens }, (cookies) => {
            cookies.forEach(cookie => {
                chrome.cookies.remove({ url: liens, name: cookie.name });
                currentBlockedCount++;
                console.log("Cookie bloqué : ", cookie.name);
            });
            // Mettre à jour le compteur global une fois le blocage terminé
            CookieBlocked += currentBlockedCount;
            UpdateCounter(); 
        });
    }

    // Le retour de cette fonction n'est pas utilisé directement car le chrome.cookies.getAll est asynchrone
    // et met à jour CookieBlocked globalement.
}

// --- Fonctions de l'Interface Utilisateur (Popup) ---

function UpdateCounter() {
    const Update = document.getElementById("counter");
    if (Update) {
        // Mettre à jour la valeur affichée avec la variable globale
        Update.textContent = CookieBlocked;
        console.log("nb mis à jour est : " + CookieBlocked);
    }
}

/**
 * Inverse l'état de blocage et met à jour l'interface.
 */
function toggleBlocking() {
    // 1. Inverse l'état
    isBlockingEnabled = !isBlockingEnabled;
    
    // 2. Stocke le nouvel état dans localStorage (pour persistance)
    localStorage.setItem('isBlockingEnabled', isBlockingEnabled);
    
    // 3. Met à jour l'apparence du bouton
    updateButtonAppearance();
    
    // 4. Affiche un message de statut
    console.log("Blocage activé : ", isBlockingEnabled);
    
    // 5. Si on vient d'activer, on relance le blocage pour l'onglet actuel
    if (isBlockingEnabled) {
        handleTabChange();
    }
}

/**
 * Met à jour le style du bouton en fonction de l'état (ON/OFF).
 */
function updateButtonAppearance() {
    const button = document.getElementById('bigRedButton');
    if (button) {
        if (isBlockingEnabled) {
            button.classList.remove('disabled');   
            button.style.backgroundColor = 'green';  // si le bouton est actif?.
        } else {
            button.classList.add('disabled');
            button.style.backgroundColor = 'gray'; // Pour griser le bouton
        }
    }
}


// --- Événements du DOM ---
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('bigRedButton');
    
    // 1. Initialiser l'apparence au chargement de la popup
    updateButtonAppearance(); 

    if (button) {
        // Ajout du listener pour le toggle
        button.addEventListener('click', toggleBlocking);

        // Code pour l'animation du bouton (gardé du code précédent)
        button.addEventListener('mousedown', () => {
            if (isBlockingEnabled) {
                 button.classList.add('active');
            }
        });
        button.addEventListener('mouseup', () => {
             button.classList.remove('active');
        });
        button.addEventListener('mouseleave', () => {
             button.classList.remove('active');
        });
    }
    
    // Charger le compteur initial au démarrage
    UpdateCounter();
});

// Votre fonction getBlockedCookieCount n'a plus besoin d'être exportée si tout est géré ici.
// export function getBlockedCookieCount() { }
