'use client'
import { useOrderList } from "@/hooks/use-order-list";
import React, { useEffect, useMemo, useState } from "react";
import { OrderTable } from "./order-table";
import { Box, Card, Divider, Stack } from "@mui/material";
import FilterForm from "./order-filter";
import { FilterPayload } from "@/types/order.constants";
import FallbackLoader from "@/components/fallback-loader/loader";
import { CustomPagination } from "@/components/core/table-pagination";
// import { Check, ExportOrders } from "@/models/order.model";
// import { exportAsFile } from "@/lib/api/export.service";
import { toast } from "sonner";
import { useHeaderTitle } from "@/hooks/header-title";

export function OrderClient(): React.JSX.Element {
    const { orderList, loading, error, reFetch } = useOrderList();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const { setHeaderTitle } = useHeaderTitle();
    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number?.parseInt(event?.target?.value, 10));
        setPage(0);
    };


    const handleFilter = (data: any) => {
        const payload = FilterPayload.BindForm(data);
        reFetch(payload);
    };

    // Calculate paginated data
    const paginatedData = useMemo(() => {
        if (!orderList) return [];
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return orderList?.slice(startIndex, endIndex);
    }, [orderList, page, rowsPerPage]);

    //exportOrders
    // const exportOrders = () => {
    //     if (!orderList || orderList.length === 0) {
    //         toast.error("No orders to export");
    //         return;
    //     }

    //     const payload = orderList?.map((order: Check) => ExportOrders?.bindForm(order))?.filter((item): item is NonNullable<typeof item> => item !== undefined);

    //     if (payload.length === 0) {
    //         toast?.error("No valid orders to export");
    //         return;
    //     }

    //     exportAsFile({ data: payload }, 'excel', 'ExportOrders');
    // }

    useEffect(() => {
        setHeaderTitle("Orders");
        if (error) {
            toast.error(error);
        }
    }, [error])

    return (
        <Box
            sx={{
                maxWidth: "var(--Content-maxWidth)",
                m: "var(--Content-margin)",
                p: "var(--Content-padding)",
                py: 2,
                width: "var(--Content-width)",
            }}
        >
            <Stack spacing={-3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: "flex-start" }}>
                    {/* <Box
                        sx={{
                            flex: "1 1 auto",
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: -7,
                        }}
                    >
                        <Typography variant="h4">Orders</Typography>
                        <Button
                            disabled={orderList?.length === 0}
                            onClick={() => { exportOrders(); }}
                            startIcon={<Export size={20} weight="regular" />}
                        >
                            Export
                        </Button>
                    </Box> */}

                </Stack>

                <Card>
                    <Divider />
                    <Box sx={{ padding: "20px" }}>
                        <FilterForm onSubmit={handleFilter} orderList={orderList} />
                        {
                            loading && <FallbackLoader />
                        }

                    </Box>
                    <Box>
                        <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 415px)" }}>
                            <OrderTable rows={paginatedData} />
                        </Box>
                        {orderList && (
                            <CustomPagination
                                count={orderList?.length}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                rowsPerPageOptions={[25, 50, 100]}
                            />
                        )}
                    </Box>
                    <Divider />
                </Card>
            </Stack>
        </Box>
    )
}