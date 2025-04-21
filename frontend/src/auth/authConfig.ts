export const msalConfig = {
    auth: {
        clientId: "a66925cd-c7b9-4e67-a576-dc5629fa073c",
        authority: `https://login.microsoftonline.com/3cadd1a7-ce2c-43b6-8986-2f1b472fab3b`,
        redirectUri: "https://frontend-service-1031980811194.europe-west12.run.app",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [`api://527ea26f-be1b-428f-8d09-2849729fe4fe/access_as_user`, 'openid', 'profile', 'email'],
    prompt: 'select_account',
};

export class logoutRequest {
}