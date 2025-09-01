export interface GratuityResponse {
    success:boolean;
    message?:string;
    data?: TaxRulesResponseData;
}

export interface GratuityByIdGraphQlResponse {
    success: boolean;
    data?: GratuityView;
    message?: string;
}

export interface GratuityGraphQlResponse {
    success: boolean;
    data?: GratuityView[];
    message?: string;
}

export type OperationType =  "C" | "R" | "U" | "D" | "NR";