export enum DeployType {
    Vercel = "vercel",
    Ios = "IOS",
    Android = "Android",
}

export interface VercelPluginOptions {
    /**
     * @description
     * Token provided by vercel to access api
     */
    token: string;

    teamId: string;
    
    apiUrl: string;
}