import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { X } from "@phosphor-icons/react";
import React, { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import FallbackLoader from "../fallback-loader/loader";
import { toast } from "sonner";
import { useGetReasonById } from "@/hooks/reasons/get-reason-byid";

export interface ReasonDetails {
    open: boolean;
    close: () => void
    id: number
};

const ReasonsDetails: React.FC<ReasonDetails> = ({ open, close, id }): React.JSX.Element => {
    const { fetchReasons, reason, loading, error } = useGetReasonById(id);
    const { t } = useTranslation();
    useEffect(() => {
        fetchReasons(id);
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    })
    return (
        <>

            {
                loading && <FallbackLoader />
            }

            <Modal
                open={open}
                onClose={close}
                aria-labelledby="summary-title"
                aria-describedby="summary-description"
            >

                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 3,
                        borderRadius: 2,
                        width: 400,
                        maxWidth: '95vw',
                    }}
                >

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            {t("Reasons:View_Reason")}
                        </Typography>
                        <IconButton onClick={close}>
                            <X size={24} />
                        </IconButton>
                    </Stack>


                    <Stack spacing={2}>
                        <Stack direction="column">
                            <Typography variant="caption" color="text.secondary">{t("Reasons:Title")}</Typography>
                            <Typography variant="body2">{reason?.Reason || '-'}</Typography>
                        </Stack>

                        <Stack direction="column">
                            <Typography variant="caption" color="text.secondary">{t("Reasons:Refund_Type")}</Typography>
                            <Typography variant="body2">{reason?.ReasonTypeObj?.Type || '-'}</Typography>
                        </Stack>

                        <Stack direction="column">
                            <Typography variant="caption" color="text.secondary">{t("Reasons:Description")}</Typography>
                            <Typography variant="body2">
                                {(reason?.Description || "-")}
                            </Typography>
                        </Stack>

                        <Stack direction="column">
                            <Typography variant="caption" color="text.secondary">{t("Reasons:Status")}</Typography>
                            <Typography variant="body2">{(reason?.Status === 1 ? 'Active' : 'Inactive')}</Typography>
                        </Stack>
                    </Stack>

                    {/* <Box mt={4} textAlign="right">
               <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={close}>
                 {t("Reason:close")}
               </Typography>
             </Box> */}
                </Box>


            </Modal>
        </>

    )
};

export default ReasonsDetails;