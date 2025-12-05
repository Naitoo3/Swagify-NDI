/**
 * Cette liste contient un ensemble de sites internet pour bloquer les cookies provenant de sites internet
 * ou les ajoute sur une liste blanche
 *   Attributs :
 *  - Domain : L'adresse vers le site internet 
 *  - type : le type de blocage qui va changer en fonction de ce qui est renseigné.
 */
export const liensTab = [
    {
        domain: "iutparis-seine.u-paris.fr", 
        type: "publicitaire",
        action: "block_unless_consent"
    },
    {
        domain: "lemonde.fr", 
        type: "analytique",
        action: "block_unless_consent"
    },
    
    {
        domain: "google-analytics.com",
        type: "analytique",
        action: "block_unless_consent"
    },
    {
        domain: "hotjar.com",
        type: "analytique",
        action: "block_unless_consent"
    },
    {
        domain: "matomo.org",
        type: "analytique",
        action: "block_unless_consent"
    },
    
    {
        domain: "doubleclick.net", // Service publicitaire de Google
        type: "publicitaire",
        action: "block_unless_consent"
    },
    {
        domain: "facebook.com", // Pour les pixels de suivi (Meta)
        type: "publicitaire",
        action: "block_unless_consent"
    },
    {
        domain: "twitter.com", // Pour les widgets de réseaux sociaux ou les traqueurs
        type: "fonctionnel" ,
        action: "block_unless_consent"
    },
    {
        domain: "adservice.google.com",
        type: "publicitaire",
        action: "block_unless_consent"
    },
    
    {
        domain: "youtube.com", // Vidéos embarquées
        type: "fonctionnel",
        action: "block_unless_consent" // Bloqué si l'utilisateur n'a pas accepté les médias
    },
    {
        domain: "vimeo.com",
        type: "fonctionnel",
        action: "block_unless_consent"
    },
    
    {
        domain: "api.votre-site-de-paiement.com", // Lien vers un service de paiement essentiel
        type: "essentiel",
        action: "whitelist"
    },
    {
        domain: "cdn.votre-domaine.com", // CDN pour les ressources statiques
        type: "essentiel",
        action: "whitelist"
    },
    {
        domain: "session-handler.votre-domaine.com", // Gestionnaire de session interne
        type: "essentiel",
        action: "whitelist"
    }
];
