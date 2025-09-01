'use client'
import React, { useState, useMemo, useEffect } from "react";
import { OrderTypeTable } from "./order-type-table";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Card, Divider } from "@mui/material";
import FallbackLoader from "@/components/fallback-loader/loader";
import { CustomPagination } from "@/components/core/table-pagination";
import { useOrderTypeList } from "@/hooks/use-order-type-list";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useHeaderTitle } from "@/hooks/header-title";

export function OrderTypeClient(): React.JSX.Element {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const {setHeaderTitle} = useHeaderTitle();
    
    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    
    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number?.parseInt(event?.target?.value, 10));
        setPage(0);
    };
    
    const { orderTypeList, error, loading } = useOrderTypeList();


    console.log(orderTypeList);
    
    
    const paginatedData = useMemo(() => {
        if (!orderTypeList) return [];
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return orderTypeList?.slice(startIndex, endIndex);
    }, [orderTypeList, page, rowsPerPage]);
    useEffect(() => {
        setHeaderTitle(t("OrderType:order_type"));
        if (error){
            toast.error(error);
        }
    }, [error])
    return (
        <Box
            sx={{
                maxWidth: "var(--Content-maxWidth)",
                m: "var(--Content-margin)",
                p: "var(--Content-padding)",
                width: "var(--Content-width)",
            }}
        >
            <Stack spacing={4}>

                <Card>
                    <Divider />
                    <Box sx={{ overflowX: "auto" }}>
                        {
                            loading && (
                                <FallbackLoader />
                            )
                        }
                        <OrderTypeTable rows={paginatedData} />
                        {orderTypeList && (
                            <CustomPagination 
                                count={orderTypeList?.length} 
                                page={page} 
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions = {[25, 50, 100]}
                            />
                        )}
                    </Box>
                    <Divider />
                </Card>
            </Stack>
        </Box>
    );
}