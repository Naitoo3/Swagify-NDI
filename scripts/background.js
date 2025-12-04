//TODO: function that collects the current URL and stores it  


 async function getCurrentURL() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true});
    return tab.url; // returns the current url
}


async function main() {
    const mainURL = await getCurrentURL();
    console.log("Hello test: ", mainURL); //Appel fonction
    
}
main();

// COLLECTE URL
// CHECK SI URL CORRESPOND AU SITE ACTUEL
// Bloquer cookie en page actuelle
// afficher nb cookies bloqués
