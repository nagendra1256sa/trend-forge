'use client';
import React, { useEffect, useMemo, useState } from 'react'
import { useHeaderTitle } from '@/hooks/header-title';
import { useTranslation } from 'react-i18next';
import { Box, Button, Card, Divider, Stack } from '@mui/material';
import { CustomPagination } from '../core/table-pagination';
import ReasonTable from './reasons.table';
import { useGetReasons } from '@/hooks/reasons/get-reasons';
import FallbackLoader from '../fallback-loader/loader';
import { ReasonTypeManager } from './reason-type-manager';
import { useDialog } from '@/hooks/use-dialog';
import { Plus } from '@phosphor-icons/react';
const ReasonClient = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const { t } = useTranslation();
    const { setHeaderTitle } = useHeaderTitle();
    const { reasons, loading, reFetch } = useGetReasons();
    const { open, handleOpen, handleClose } = useDialog();
    const handlePageChange = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClosePopup = (isRefetch?: boolean) => {
        handleClose();
        setPage(0);
        setRowsPerPage(25);
        if (isRefetch) reFetch();
        
    }

    const paginatedData = useMemo(() => {
        if (!reasons) return [];
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return reasons?.slice(startIndex, endIndex);
    }, [reasons, page, rowsPerPage]);

    useEffect(() => {
        setHeaderTitle(t('Reasons:Reasons'));
    }, []);

    return (
        <>
            {
                loading && <FallbackLoader />
            }
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

                    <Card>
                        <Divider />
                        <Box>
                            <ReasonTable rows={paginatedData} reFetchList={handleClosePopup} />

                            {reasons && (
                                <CustomPagination
                                    count={reasons?.length}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleRowsPerPageChange} rowsPerPageOptions={[25, 50, 100]} />
                            )}
                        </Box>
                        <Divider />
                    </Card>
                </Stack>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    sx={{
                        position: 'fixed',
                        bottom: 70,
                        right: 24,
                        borderRadius: '50%',
                        minWidth: 56,
                        width: 56,
                        height: 56,
                        padding: 0,
                        zIndex: 1000,
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                        }
                    }}
                >
                    <Plus size={24} />
                </Button>
            </Box>
            {
                open && <ReasonTypeManager pageType="reasons" open={true} close={(isRefetch) => handleClosePopup(isRefetch)} />
            }
        </>
    )
}

export default ReasonClient;