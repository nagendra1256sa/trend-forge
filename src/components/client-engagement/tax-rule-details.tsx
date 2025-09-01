'use cliet'
import { useGetTaxRuleDetails } from "@/hooks/menu-items-hooks/use-get-tax-rules";
import { useGetLocations } from "@/hooks/use-get-locations";
import { useMasterJson } from "@/hooks/use-master-json";
import { Location } from "@/models/tax-rule.model";
import { TaxRuleDetailsProps } from "@/types/tax-rule"
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CreditCard, MapPin, Tag, X } from "@phosphor-icons/react";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import FallbackLoader from "../fallback-loader/loader";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";



const TaxRuleDetails: React.FC<TaxRuleDetailsProps> = ({ open, close, taxId }: TaxRuleDetailsProps): React.JSX.Element => {
  const { locations, loading: locationLoading, error: locationError } = useGetLocations();
  const { taxRuleDetails, error, loading } = useGetTaxRuleDetails(taxId ?? 0);
  const { masterJson } = useMasterJson();

  const {t} = useTranslation()
  const getLocationName = (locationId: number): string => {
    if (locationId) {
      const loc = locations?.find(
        (location: Location) => location?.id === locationId,
      );
      return loc ? loc?.name : "-";
    } else {
      return "-";
    }
  };

  const getRateType = (rateValue: number) => {
    if (rateValue) {
      const rateType = masterJson?.rate_type?.find(
        (RateType: any) => Number(RateType.key) === rateValue,
      );
      return rateType ? rateType.value : "-";
    } else {
      return "-";
    }
  };

  const getMetricType = (metricValue: number) => {
    if (metricValue) {
      const metricType = masterJson?.metric_type?.find(
        (RateType: any) => Number(RateType.key) === metricValue,
      );
      return metricType ? metricType.value : "-";
    } else {
      return "-";
    }
  };

  useEffect(() => {
    if (error || locationError) {
      toast.error('Ooops somthing went wrong...!');
    };
  }, []);
  return (<>
    {
      loading || locationLoading && <FallbackLoader />
    }
    <Modal
      open={open}
      onClose={close}
      aria-labelledby="summary-title"
      aria-describedby="summary-description"
    >
      <Box
        key={taxId}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          width: 600,
        }}

      >

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            {taxRuleDetails?.name}
          </Typography>
          <IconButton onClick={close}>	<X size={24} /></IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t("menuItem:code")} <strong>{taxRuleDetails?.code ?? '-'}</strong>
        </Typography>


        <Stack direction="row" spacing={3} mb={1}>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2" color="text.disabled">
              {t("menuItem:effective_date")}
            </Typography>
            <Typography variant="body2">
              {dayjs(taxRuleDetails?.start).format('MMM DD, YYYY hh:mm A')}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2" color="text.disabled">
             {t("menuItem:expiry_date")}
            </Typography>
            <Typography variant="body2">
              {dayjs(taxRuleDetails?.end).format('MMM DD, YYYY hh:mm A')}
            </Typography>
          </Stack>
        </Stack>

        {
          taxRuleDetails?.rates?.map((element) => {
            return <>
              <Stack direction="row" alignItems="center" spacing={2} mt={2} key={element?.id}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MapPin size={18} />
                  <Typography variant="body2">{getLocationName(element?.loc)}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tag size={18} />
                  <Typography variant="body2">
                    {getMetricType(element?.metric)}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <CreditCard size={18} />
                  <Typography variant="body2">{getRateType(element?.rate)}</Typography>
                </Stack>
              </Stack>

            </>
          })
        }
      </Box>
    </Modal>

  </>)
}

export default TaxRuleDetails;