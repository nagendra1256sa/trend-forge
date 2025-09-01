import { Reason } from "@/models/reasons";

export interface getReasonsHookTypes{
    reasons : Reason[];
    error: string;
    loading: boolean;
     reFetch: () => void
};

export interface getReasonByIdHookTypes{
    reason: Reason | null;
    error: string | null;
    loading: boolean;
     fetchReasons: (id: number) => Promise<void>
};
