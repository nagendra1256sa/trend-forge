'use client'

import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import { Card, Divider } from "@mui/material";
import { MenuItemsListTable } from "./client-table";
import { useGetMenuItemsList } from "@/hooks/menu-items-hooks/use-get-menu-list";
import { MenuItemListPagination } from "./menu-item-pagination";
import FallbackLoader from "../fallback-loader/loader";
import { toast } from "sonner";
import { useMenuUpdate } from "@/hooks/menu-items-hooks/use-update-menu";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@/models/menu-item.model";
import { MenuItemFilters } from "./menu-item-filters";
import { useHeaderTitle } from "@/hooks/header-title";
import { ClientCards } from "../dashboard/logistics/on-route-vehicles";



interface MenuItemClientPageProps {
    name?: string;
    sku?: string;
};



const applyFilters = (rows: MenuItem[], { name, sku }: MenuItemFilters): MenuItem[] => {
    return rows.filter((item) => {
        if (name && !item.label?.toLowerCase().includes(name.toLowerCase())) {
            return false;
        }
        if (sku && !item.sku?.toLowerCase().includes(sku.toLowerCase())) {
            return false;
        }
        return true;
    });
}

export function MenuItemClient({ name, sku }: MenuItemClientPageProps): React.JSX.Element {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const clientData = [
        { count: 38, text: "All time Clients" },
        { count: 2, text: "Inactive Clients" },
        { count: 3, text: "Total Users" },
        { count: 5, text: "Active Projects" },
    ]

    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    const { menuDetails, error: err, loading, reFetch } = useGetMenuItemsList();

    const { menuItem } = useMenuUpdate();
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeaderTitle();


    const filteredProducts = useMemo(() => {
        if (!menuDetails) return [];
        return applyFilters(menuDetails, { name, sku });
    }, [menuDetails, name, sku]);

    const paginatedData = useMemo(() => {
        if (!filteredProducts) return [];
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, page, rowsPerPage]);

    useEffect(() => {
        setHeaderTitle(t("menuItem:menu_items"));
        if (err) {
            toast.error('Oops something went wrong...!');
        }
        if (menuItem) {
            const index = menuDetails?.findIndex(item => item?.id === menuItem?.id);
            if (index !== undefined && index >= 0) {
                menuDetails?.splice(index, 1, menuItem);
            }
        }
    }, [err, menuItem, menuDetails]);

    return (
        <>
            {loading && <FallbackLoader />}
            <Box
                sx={{
                    maxWidth: "var(--Content-maxWidth)",
                    m: "var(--Content-margin)",
                    p: "var(--Content-padding)",
                    py: 3,
                    width: "var(--Content-width)",
                }}
            >
                <Stack spacing={4}>
                    <Grid container spacing={4}>

                        {

                            clientData?.map((data, index) => (
                                <Grid
                                    key={index}
                                    size={{
                                        md: 3,
                                        xs: 12,
                                    }}
                                >
                                    <ClientCards count={data?.count} text={data?.text} />
                                </Grid>
                            ))
                        }
                    </Grid>


                    <Card>
                        <Divider />
                        <Box>

                            <MenuItemsListTable rows={paginatedData} onUpdateFetchList={reFetch} />
                            {filteredProducts && (
                                <MenuItemListPagination
                                    count={filteredProducts.length}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                />
                            )}
                        </Box>
                        <Divider />
                    </Card>
                </Stack>
            </Box>
        </>
    );
}
