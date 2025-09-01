'use client'
import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useEffect } from 'react'
import GratuityTable from './gratuity-table'
import { useGetGratuityData } from '@/hooks/graphql'
import { toast } from 'sonner'
import { useHeaderTitle } from '@/hooks/header-title'

const GratuityClient = () => {
    const { gratuityViewData, loading, error } = useGetGratuityData();
    const { setHeaderTitle } = useHeaderTitle();
    useEffect(() => {
        setHeaderTitle("Gratuity");
        if (error) {
            toast.error(error);
        }
    }, [error])
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
                        <Box>
                            <Box sx={{ overflow: "auto", maxHeight: "calc(100vh - 320px)" }}>
                                <GratuityTable rows={gratuityViewData ?? []} loading={loading} />
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

export default GratuityClient
