import { auth, Client } from "twitter-api-sdk";
export declare const clients: Record<string, auth.OAuth2User>;
export declare const authedClients: Record<string, Client>;
export declare const getSessionKey: () => string;
export declare const initClient: (callback: string, sessionKey: string) => auth.OAuth2User;
export declare const deleteClient: (state: string) => void;
export declare const getClient: (state: string) => auth.OAuth2User;
export declare const generateAuthURL: (client: auth.OAuth2User, state: string) => string;
export declare type TwitterFindMyUserResponse = {
    id?: string;
    name?: string;
    username?: string;
};
export declare const requestFindMyUser: (client: auth.OAuth2User, code: string) => Promise<TwitterFindMyUserResponse>;
export declare type TwitterFollowerResponse = {
    username?: string;
    followerCount?: number;
};
export declare const getFollowerCount: (client: auth.OAuth2User, code: string) => Promise<TwitterFollowerResponse>;
export declare type TwitterTweetResponse = {
    username?: string;
    tweetCount?: number;
};
export declare const getTweetCount: (client: auth.OAuth2User, code: string) => Promise<TwitterTweetResponse>;
