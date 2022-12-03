import { BrightIdProcedureResponse } from "@gitcoin/passport-types";
export declare const verifyBrightidContextId: (contextId: string) => Promise<BrightIdProcedureResponse>;
export declare const triggerBrightidSponsorship: (contextId: string) => Promise<BrightIdProcedureResponse>;
