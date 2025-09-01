import { MenuItemPaginationProps } from "@/types/menu";
import { TablePagination } from "@mui/material";
import React from "react";


export function MenuItemListPagination({ 
    count, 
    page, 
    onPageChange, 
    rowsPerPage,
    onRowsPerPageChange
}: MenuItemPaginationProps): React.JSX.Element {
    return (
        <TablePagination
            component="div"
            count={count}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[25, 50, 100]}
        />
    );
}