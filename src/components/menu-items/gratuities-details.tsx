'use cliet'
import { useGetGraphQlData } from "@/hooks/graphql";
import { metricTypes } from "@/types/menu.constant";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { X } from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import FallbackLoader from "../fallback-loader/loader";

interface GratuitiesProps {
  open: boolean;
  close: () => void;
  gratuityId: number;
}


export const GratuityDetailPopup: React.FC<GratuitiesProps> = ({ open, close, gratuityId }: GratuitiesProps): React.JSX.Element => {

  const { gratuityViewData, error, loading } = useGetGraphQlData(gratuityId)

  const { t } = useTranslation();
  useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);
  if(loading){
    return <FallbackLoader/>;
  }
  return (<>
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
            {t("menuItem:view_tax_rules")}
          </Typography>
          <IconButton onClick={close}>
            <X size={24} />
          </IconButton>
        </Stack>

        <Typography variant="subtitle1" fontWeight={600} mb={2}>
         {t("menuItem:general_information")}
        </Typography>

        <Stack spacing={2}>
          <Stack direction="column">
            <Typography variant="caption" color="text.secondary">{t("menuItem:name")}</Typography>
            <Typography variant="body2">{gratuityViewData?.name || '-'}</Typography>
          </Stack>

          <Stack direction="column">
            <Typography variant="caption" color="text.secondary">{t("menuItem:code")}</Typography>
            <Typography variant="body2">{gratuityViewData?.code || '-'}</Typography>
          </Stack>

          <Stack direction="column">
            <Typography variant="caption" color="text.secondary">{t("menuItem:metric_type")}</Typography>
            <Typography variant="body2">
              {(gratuityViewData?.metricType && metricTypes[gratuityViewData.metricType as keyof typeof metricTypes]) || "-"}
            </Typography>
          </Stack>

          <Stack direction="column">
            <Typography variant="caption" color="text.secondary">{t("menuItem:rate")}</Typography>
            <Typography variant="body2">{gratuityViewData?.rate || '-'}</Typography>
          </Stack>

          <Stack direction="column">
            <Typography variant="caption" color="text.secondary">{t("menuItem:status")}</Typography>
            <Typography variant="body2">{(gratuityViewData?.status === 1 ? 'Active' : 'Inactive')}</Typography>
          </Stack>
        </Stack>

        {/* <Box mt={4} textAlign="right">
          <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={close}>
            {t("menuItem:close")}
          </Typography>
        </Box> */}
      </Box>


    </Modal>
  </>)
}