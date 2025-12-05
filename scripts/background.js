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
    BlocageCookie(); 
});

// partie cookie

function loadWhitelist() {
    return lienstab;
} // on rend simplement le tableau disponible

function BlocageCookie() {
    
    const liens = getCurrentURL();
    const liensTab = loadWhitelist();
    let CookieBlocked = 0;
    
    if (!liensTab || liensTab.length === 0) {
        return false;
    }

    for (const ruleObject of liensTab) {

        if (liens.includes(ruleObject)) {
            return;
        }

        chrome.cookies.getAll({ url: liens }, (cookies) => {
            cookies.forEach(cookie => {
                chrome.cookies.remove({ url: liens, name: cookie.name });
                CookieBlockedCount++;
            });
        });
    }
    return CookieBlocked;
}

export function getBlockedCookieCount() {}




// Bloquer cookie en page actuelle ( A FAIRE )
// afficher nb cookies bloqués
