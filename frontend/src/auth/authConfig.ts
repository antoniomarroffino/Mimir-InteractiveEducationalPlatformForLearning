export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "a66925cd-c7b9-4e67-a576-dc5629fa073c",
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || "3cadd1a7-ce2c-43b6-8986-2f1b472fab3b"}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI || "https://frontend-service-1031980811194.europe-west12.run.app",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [`api://${import.meta.env.VITE_BACKEND_CLIENT_ID || "527ea26f-be1b-428f-8d09-2849729fe4fe"}/access_as_user`, 'openid', 'profile', 'email'],
    prompt: 'select_account',
};

export class logoutRequest {
}