import { Location } from "@/models/tax-rule.model";

export interface TaxRulesResponseByBcId {
    success: boolean;
    message?: string;
    data?: TaxRulesResponseData;
}
export interface TaxRulesResponse {
    success: boolean;
    message?: string;
    data?: TaxRuleList[];
}
export interface TaxRuleDetailsProps {
    open: boolean;
    close: () => void;
    taxId: number | undefined;
}

export interface LocationsResponse {
    success: boolean;
    locations?: Location[];
    message?: string;
}