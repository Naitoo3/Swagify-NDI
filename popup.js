
function updateCounter() {
    let counterElement = document.getElementById("counter");
    if (counterElement) {
        counterElement.textContent = count;
        console.log("UpdatedCount is now : " + count);
    }
    return counterElement;
}   

/**
 * Met à jour le style du bouton en fonction de l'état (ON/OFF).
 */
function updateButtonAppearance(isEnabled) {
    const button = document.getElementById('bigRedButton');
    if (button) {
        if (isEnabled) {
            button.classList.remove('disabled');
            button.style.backgroundColor = '#4FFF60'; // Active
        } else {
            button.classList.add('disabled');
            button.style.backgroundColor = '#8F8F8F'; // Disabled
        }
    }
}

/**
 * Déclenché par le clic du bouton. Envoie un message au Service Worker pour basculer l'état.
 */
function toggleBlocking() {
    chrome.runtime.sendMessage({ action: "CookieBlocker" }, (response) => {
        if (response && response.newState !== undefined) {
            // Met à jour l'interface en fonction de la réponse du Service Worker
            updateButtonAppearance(response.newState);
        }
    });
}


// --- Événements du DOM et Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('bigRedButton');
    
    chrome.runtime.sendMessage({ action: "getInitialState" }, (response) => {
        if (response) {
            // Initialiser l'interface avec les données reçues
            updateButtonAppearance(response.isBlockingEnabled);
            updateCounter(response.blockedCount);
        }
    });
    
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === "counterUpdated") {
            updateCounter(request.newCount);
        }
    });
    

    if (button) {
        button.addEventListener('click', toggleBlocking);

        button.addEventListener('mousedown', () => {
            if (!button.classList.contains('disabled')) {
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
});
