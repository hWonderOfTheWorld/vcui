export declare type ProviderError = {
    name?: string;
    message?: string;
    response?: {
        status?: number;
        statusText?: string;
        data: unknown;
    };
};
export declare function getErrorString(error: ProviderError): string;
