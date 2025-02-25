import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig.ts";

export const msalInstance = new PublicClientApplication(msalConfig);