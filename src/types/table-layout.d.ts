import { SectionLayout, TableDetails } from "@/models/table-layout";

export interface GetLayoutsResponse {
    success: boolean;
    layouts?: SectionLayout[],
    message?: string
}

export interface GetTableDetailsResponse {
    success: boolean;
    tables?: TableDetails[],
    message?: string
}

export interface GetCreateTableResponse {
    success: boolean;
    message?: string;
    skipped: string[];
}


export interface UseGetLayoutSections {
    layoutSections: SectionLayout[];
    error: string;
    loading: boolean;
    refetch: () => void;
    setLayoutsSections: Dispatch<SetStateAction<SectionLayout[]>>;
}

export interface UseGetTables {
    tables: TableDetails[];
    error: string;
    loading: boolean;
    refetch: (layoutId: number) => void;
    setTables: Dispatch<SetStateAction<TableDetails[]>>
}

export interface UseCreateTable{
     createTables: (layoutId: number, tables: TableBinder[]) => Promise<void>;
    error: string;
    message: string | undefined;
    loading: boolean;
} 

export interface updateTableResponse {
    success: boolean;
    message?: string
}

export interface DeleteTableResponse {
    success: boolean;
    message?: string
}
export interface CreateTableResponse {
    success: boolean;
    message?: string;
    skipped?: any;
}
export interface AddNewSectionResponse {
    success: boolean;
    message?: string
}

export interface GetReportResponse {
    success: boolean;
    message?: string;
}