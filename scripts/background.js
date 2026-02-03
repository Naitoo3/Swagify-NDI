import LiensTableau from './rules.js';
    
// gets the current URL that the user is actively on.
/**
 * @summary Grabs the current url of the webpage is user is currently on, and saves it inside array.url.
 * @param None.
 * @returns array.url
 */
async function getCurrentURL() {
    const [array] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        if (!array || !array.url) {
            console.log(array.url);
            return null;
        }
        return array.url;
    
}
/**
 * 
 * @summary detects if a tab is changed, and updates the cookie counter. 
 */
async function handleTabChange() {
    const CurrentURL = await getCurrentURL(); // We grab the current link.
    console.log("Tab changed, current URL is :", CurrentURL);
    await CookieBlocker();
    UpdateCounter(); // We block cookies, and update the counter.

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

// --- Whitelist management --- 
function loadWhitelist() {
    return LiensTableau; // returns the array of links
}

async function CookieBlocker() {
    let IsEnabled = 1; // 1 for on, 0 for off.
    let CookieBlocked = 0;
    const Links = await getCurrentURL();
    const whitelist = loadWhitelist();

    if (whitelist.includes(Links)) {
        if (IsEnabled) {
        chrome.cookies.getAll({url: Links}, (cookies) => {
            cookies.forEach(cookies => {
                chrome.cookies.remove({url: Links, name: cookies.name});
                CookieBlocked++;
                console.log("Cookie blocked", cookies.name);
                UpdateCounter();
            });
        });
    }
    return CookieBlocked; // to be used in popup.js (displays the amount of blocked cookies essentially)
    }
}

async function UpdateCounter(counterElement) {
    let counterUpdated = counterElement;
    if (counterUpdated) {
        counterUpdated.textContent = CookieBlocked;
        console.log("Updated" + CookieBlocked);
    }
}


// Update the button for toggling or not

function ToggleButton() {
    let ButtonState = true; // We block cookies by default.
    UpdateButton();
    console.log("Blocking Enabled !", ButtonState);
        if (ButtonState == true) {
        handleTabChange();
    }

    else if(ButtonState == false) {
        console.log("cookie blocking is now disabled.");
    }

    return ButtonState;  
} 

// TODO: Make this Work

