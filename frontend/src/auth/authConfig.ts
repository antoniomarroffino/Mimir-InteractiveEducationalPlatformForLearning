export const msalConfig = {
    auth: {
        clientId: "e60732a1-5fd8-4c12-8a48-db860b8d4409", // Sostituisci con il tuo client ID
        authority: "https://login.microsoftonline.com/3cadd1a7-ce2c-43b6-8986-2f1b472fab3b", // Sostituisci con il tuo tenant ID
        redirectUri: "http://localhost:3000", // URL di reindirizzamento
    },
    cache: {
        cacheLocation: "sessionStorage", // Memorizza il token in sessionStorage
        storeAuthStateInCookie: false, // Non usare i cookie per memorizzare lo stato
    }
};

export const loginRequest = {
    scopes: ["User.Read"], // Scope richiesti
    prompt: 'select_account',
};