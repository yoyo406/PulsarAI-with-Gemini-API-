import { GoogleGenAI } from "https://cdn.jsdelivr.net/npm/@google/genai@0.2.1/dist/index.min.js";

// Éléments du DOM
const apiKeyInput = document.getElementById('api-key-input');
const setApiKeyBtn = document.getElementById('set-api-key-btn');
const chatContainer = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const loadingIndicator = document.getElementById('loading-indicator');

// Variables d'état de l'API
let ai = null;
let chat = null;
const model = "gemini-2.5-flash"; // Modèle rapide et stable

// --- Fonctions d'aide ---

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    // Remplacer les sauts de ligne par des balises <br> pour l'affichage HTML
    const formattedText = text.replace(/\n/g, '<br>');
    messageDiv.innerHTML = `<p>${formattedText}</p>`;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Défilement vers le bas
}

function toggleChat(enable) {
    userInput.disabled = !enable;
    sendButton.disabled = !enable;
    apiKeyInput.disabled = enable;
    setApiKeyBtn.disabled = enable;
    if (enable) {
        userInput.focus();
        appendMessage('ai', "Clé API validée. Le chat est maintenant actif !");
    }
}

// --- Logique d'initialisation de la clé API ---

setApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key === '') {
        alert("Veuillez entrer une clé API valide.");
        return;
    }

    try {
        // Initialiser le SDK avec la clé de l'utilisateur
        ai = new GoogleGenAI({ apiKey: key });
        
        // Créer une nouvelle session de chat pour conserver l'historique
        chat = ai.chats.create({ model });

        // Tenter un simple appel pour vérifier si la clé fonctionne (ou simplement l'activer)
        // Pour des raisons de rapidité et d'éviter un appel inutile : nous l'activons directement.
        // Les erreurs d'API seront gérées dans sendMessage.
        toggleChat(true);

    } catch (error) {
        console.error("Erreur d'initialisation de l'API:", error);
        alert("Erreur lors de l'initialisation de l'API. Assurez-vous que la clé est correcte.");
        // Réinitialiser les variables en cas d'échec
        ai = null;
        chat = null;
        toggleChat(false);
    }
});

// --- Logique d'envoi de message ---

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !userInput.disabled) {
        sendMessage();
    }
});

async function sendMessage() {
    const prompt = userInput.value.trim();
    if (prompt === '') return;
    if (!chat) {
        alert("Veuillez d'abord initialiser le chat avec votre clé API.");
        return;
    }

    // Afficher le message de l'utilisateur
    appendMessage('user', prompt);
    userInput.value = '';
    
    // Désactiver le chat pendant le traitement et afficher l'indicateur
    toggleChat(false);
    loadingIndicator.style.display = 'block';

    try {
        // Envoyer le message en utilisant la session de chat
        const response = await chat.sendMessage({ message: prompt });
        
        // Récupérer le texte de la réponse
        const responseText = response.text;

        appendMessage('ai', responseText);
        
    } catch (error) {
        console.error("Erreur Gemini API:", error);
        // Afficher un message d'erreur clair pour l'utilisateur
        appendMessage('ai', `Désolé, une erreur est survenue lors de la communication avec l'API Gemini. (Vérifiez la console pour les détails de l'erreur, la clé est peut-être invalide ou expirée.)`);
        
    } finally {
        // Réactiver le chat et masquer l'indicateur
        toggleChat(true);
        loadingIndicator.style.display = 'none';
        userInput.focus(); // Renvoyer le focus à l'entrée
    }
}