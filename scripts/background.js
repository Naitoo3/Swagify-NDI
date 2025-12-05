import liensTab from "./rules.js";

async function getCurrentURL() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab.url) { return; }
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
    return liensTab;
} // on rend simplement le tableau disponible

async function BlocageCookie() {

    const liens = await getCurrentURL();
    const liensTab = loadWhitelist();
    let CookieBlocked = 0;

    if (!liensTab || liensTab.length === 0) {
        return false;
    }

    for (const ruleObject of liensTab) {

        if (!liensTab.includes(ruleObject)) {
            return;
        }

        console.log("aaaa");

        chrome.cookies.getAll({ url: liens }, (cookies) => {
            cookies.forEach(cookie => {
                chrome.cookies.remove({ url: liens, name: cookie.name });
                CookieBlocked++;
                console.log("Cookie bloqué : ", cookie.name);
            });
        });
    }
    return CookieBlocked;
}

export function getBlockedCookieCount() { }




// Bloquer cookie en page actuelle ( A FAIRE )
// afficher nb cookies bloqués