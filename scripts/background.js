//TODO: function that collects the current URL and stores it  
import { lienstab } from "./rules.js"; // importation 

 async function getCurrentURL() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true});
    return tab.url; // returns the current url
}

async function handleTabChange() {
    const currentURL = await getCurrentURL();
    console.log("Tab changed, current URL: ", currentURL);
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    await handleTabChange();
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        await handleTabChange();
    }
});

// partie cookie

function loadWhitelist() {
    return lienstab;
} // on rend simplement le tableau disponible
function BlocageCookie() {
    liensTab = loadWhitelist(); // On récupère les données de load white list
    
}

// COLLECTE URL
// CHECK SI URL CORRESPOND AU SITE ACTUEL
// Bloquer cookie en page actuelle
// afficher nb cookies bloqués
