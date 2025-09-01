'use client'
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Card, Divider } from "@mui/material";
import TaxRulesTable from "./tax-rules-table";
import { useTaxRule } from "@/hooks/use-taxrules";
import { toast } from "sonner";
import { useHeaderTitle } from "@/hooks/header-title";
const TaxRulesClient = () => {
    const { taxData, isLoading, error } = useTaxRule();
    const { setHeaderTitle } = useHeaderTitle();
    useEffect(() => {
        setHeaderTitle("Tax Rules");
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return (
        <>
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
                        <Box>
                            <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 320px)" }}>
                                <TaxRulesTable rows={taxData ?? []} loading={isLoading} />
                            </Box>
                            {/* {menuDetails && (
                            < MenuItemListPagination
                                count={menuDetails?.length}
                                page={page}
                                onPageChange={handlePageChange}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        )} */}
                        </Box>
                    </Card>
                </Stack>
            </Box>

        </>
    )
}

export default TaxRulesClient