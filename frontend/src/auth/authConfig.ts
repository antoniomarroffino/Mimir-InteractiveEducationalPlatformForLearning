export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID!, // Sostituisci con il tuo client ID
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`, // Sostituisci con il tuo tenant ID
        redirectUri: import.meta.env.VITE_REDIRECT_URI!, // URL di reindirizzamento
    },
    cache: {
        cacheLocation: "sessionStorage", // Memorizza il token in sessionStorage
        storeAuthStateInCookie: false, // Non usare i cookie per memorizzare lo stato
    }
};

export const loginRequest = {
    scopes: [`api://${import.meta.env.VITE_BACKEND_CLIENT_ID}/access_as_user`], // Scope richiesti
    prompt: 'select_account',
};