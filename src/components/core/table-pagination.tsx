import { TablePagination } from "@mui/material";
import React from "react";

interface PaginationProps {
    count: number;
    page: number;
    onPageChange: (event: unknown, newPage: number) => void;
    rowsPerPage: number;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowsPerPageOptions: number[];
}

export function CustomPagination({ 
    count, 
    page, 
    onPageChange, 
    rowsPerPage,
    onRowsPerPageChange,
    rowsPerPageOptions
}: PaginationProps): React.JSX.Element {
    return (
        <TablePagination
            component="div"
            count={count}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
        />
    );
}