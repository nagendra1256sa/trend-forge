'use client';
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMasterJson } from "@/hooks/use-master-json";
import dayjs, { Dayjs } from "dayjs";
import { sourceOptions } from "@/types/order.constants";
import { useTranslation } from "react-i18next";
import { useOrderTypeList } from "@/hooks/use-order-type-list";
import { OrderType } from "@/models/order-type.model";
import FallbackLoader from "@/components/fallback-loader/loader";
import { toast } from "sonner";
import { CheckStatusType, ChekStatusAdapter } from "@/models/check-status.model";
import { Export } from "@phosphor-icons/react";
import { Check, ExportOrders } from "@/models/order.model";
import { exportAsFile } from "@/lib/api/export.service";

interface FilterFormData {
  checkId?: string;
  status: string[];
  source: string[];
  employeeName: string;
  orderType: number[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface FilterFormProps {
  onSubmit: (data: FilterFormData) => void;
  orderList: Check[] | undefined;
}

export default function FilterForm({ onSubmit, orderList }: FilterFormProps): React.JSX.Element {
  const { masterJson, error } = useMasterJson({ 'filter-check-status': true });
  const { t } = useTranslation();
  const { orderTypeList, loading: orderTypeLoading } = useOrderTypeList();

  const [checkStatus, setChekStatus] = useState<CheckStatusType[]>();

  useEffect(() => {
    setChekStatus(masterJson?.check_status?.map((data: CheckStatusType) => new ChekStatusAdapter().adapt(data)))

  }, [masterJson])

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<FilterFormData>({
    defaultValues: {
      checkId: "",
      status: [],
      source: [],
      employeeName: "",
      orderType: [],
      startDate: dayjs(),
      endDate: dayjs(),
    },
  });

  const status = watch("status");
  const source = watch("source");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const employeeName = watch("employeeName");
  const orderType = watch("orderType");
  const checkId = watch("checkId");

  const [searchStatus, setSearchStatus] = useState("");
  const [searchSource, setSearchSource] = useState("");
  const [searchOrderType, setSearchOrderType] = useState("");

  const filteredStatusOptions = useMemo(() => {
    return checkStatus?.filter((option: any) =>
      option?.value?.toLowerCase().includes(searchStatus.toLowerCase())
    );
  }, [checkStatus, searchStatus]);

  const filteredSourceOptions = useMemo(() => {
    return sourceOptions.filter((opt) =>
      opt?.value?.toLowerCase().includes(searchSource.toLowerCase())
    );
  }, [searchSource]);

  const filteredOrderTypeOptions = useMemo(() => {
    return orderTypeList?.filter((opt: OrderType) =>
      opt?.label?.toLowerCase().includes(searchOrderType?.toLowerCase())
    );
  }, [orderTypeList, searchOrderType]);

  // Determine if any filter is selected
  const isAnyFilterApplied =
    status?.length > 0 || source?.length > 0 || startDate || endDate !== null || employeeName !== "" || orderType?.length > 0 || checkId !== "";

  const handleClear = () => {
    reset();
    onSubmit({
      status: [],
      source: [],
      employeeName: "",
      checkId: "",
      orderType: [],
      startDate: dayjs(),
      endDate: dayjs(),
    });
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    const values = watch();
    const payload = {
      ...values,
      startDate: values.startDate ? dayjs(values.startDate) : null,
      endDate: values.endDate ? dayjs(values.endDate) : null,
    };
    onSubmit(payload);
  }, []);

  //exportOrders
  const exportOrders = () => {
    if (!orderList || orderList.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const payload = orderList?.map((order: Check) => ExportOrders?.bindForm(order))?.filter((item): item is NonNullable<typeof item> => item !== undefined);

    if (payload.length === 0) {
      toast?.error("No valid orders to export");
      return;
    }

    exportAsFile({ data: payload }, 'excel', 'ExportOrders');
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {

        orderTypeLoading && <FallbackLoader />

      }

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        alignItems="self-end"
        gap={2}
        flexWrap="wrap"
        sx={{ padding: "10px" }}
      >


        {/** Check Id */}

        <FormControl sx={{ minWidth: 150, width: 150 }}>
          <Controller
            name="checkId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Order Id"
                variant="outlined"
                fullWidth
                placeholder="Enter Order Id"
                size="small"
              />
            )}
          />
        </FormControl>


        {/* Status Select */}

        <FormControl sx={{ minWidth: 150, wdith: 150, maxWidth: 190 }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="status-label"
                label="Status"
                multiple
                size="small"
                renderValue={(selected: string[]) => {
                  const labels = selected
                    .map(
                      (selectedKey) =>
                        checkStatus?.find((opt: any) => opt?.key === selectedKey)?.value
                    )
                    .filter(Boolean);
                  const [first, ...rest] = labels;
                  return rest?.length > 0 ? `${first} (+${rest?.length} more)` : first || "";
                }}
                MenuProps={{ disableAutoFocusItem: true }}
              >
                {/* Search Box */}
                <MenuItem
                  disableRipple
                  disableTouchRipple
                  disableGutters
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={t("Order:search_status")}
                    value={searchStatus}
                    onChange={(e) => setSearchStatus(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </MenuItem>

                {/* Total selection count */}
                {status?.length && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("Order:selected")}: {watch("status")?.length || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => reset({ ...watch(), status: [] })}
                    >
                      {t("Order:clear_all")}
                    </Typography>
                  </Box>
                )}

                {/* Filtered Options */}
                {filteredStatusOptions?.map((option: any) => (
                  <MenuItem key={option?.key} value={option?.key}>
                    <Checkbox checked={field?.value?.includes(option?.key) || false} />
                    <ListItemText primary={option?.value} />
                  </MenuItem>
                ))}

                {/* No match fallback */}
                {filteredStatusOptions?.length === 0 && (
                  <MenuItem disabled>{t('Order:no_results_found')}</MenuItem>
                )}
              </Select>
            )}
          />
        </FormControl>

        {/* Source Select */}
        <FormControl sx={{ minWidth: 190 }}>
          <InputLabel id="source-label">Source</InputLabel>
          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="source-label"
                label={t("Order:source")}
                multiple
                size="small"
                renderValue={(selected: string[]) => {
                  const labels = selected
                    .map((selectedKey) => sourceOptions.find((opt) => opt.key === selectedKey)?.value)
                    .filter(Boolean);
                  const [first, ...rest] = labels;
                  return rest.length > 0 ? `${first} (+${rest.length} more)` : first || "";
                }}
              >
                {/* Search Box */}
                <MenuItem
                  disableRipple
                  disableTouchRipple
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    autoFocus
                    fullWidth
                    placeholder={t("Order:search_source")}
                    value={searchSource}
                    onChange={(e) => setSearchSource(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </MenuItem>

                {/* Total selection count */}
                {source?.length && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("Order:selected")}: {watch("source")?.length || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => reset({ ...watch(), source: [] })}
                    >
                      {t("Order:clear_all")}
                    </Typography>
                  </Box>
                )}

                {filteredSourceOptions.map((type: { key: string; value: string }) => (
                  <MenuItem key={type.key} value={type.key}>
                    <Checkbox checked={field.value?.includes(type.key) || false} />
                    <ListItemText primary={type.value} />
                  </MenuItem>
                ))}

                {/* No match fallback */}
                {filteredSourceOptions?.length === 0 && (
                  <MenuItem disabled>{t("Order:no_results_found")}</MenuItem>
                )}
              </Select>
            )}
          />
        </FormControl>

        {/* Start Date */}
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={t("Order:start_date")}
              value={field.value}
              onChange={field.onChange}
              maxDate={endDate ?? dayjs()} // Don't allow after endDate
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 150, width: 150 },
                },
              }}
            />
          )}
        />

        {/* End Date */}
        <Controller
          name="endDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label={t("Order:end_date")}
              value={field.value}
              onChange={field.onChange}
              minDate={startDate ?? undefined} // Should be same or after startDate
              maxDate={dayjs()} // Cannot go beyond today
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 150, width: 150 },
                },
              }}
            />
          )}
        />

        {/** Employee name */}
        {/*
        <FormControl sx={{ minWidth: 200 }}>
          <Controller
            name="employeeName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Employee Name"
                variant="outlined"
                fullWidth
                placeholder="Enter employee name"
              />
            )}
          />
        </FormControl> */}

        {/* Order Type Select */}
        <FormControl sx={{ minWidth: 150, width: 200 }}>
          <InputLabel id="orderType-label">{t("OrderType:order_type")}</InputLabel>
          <Controller
            name="orderType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId="orderType-label"
                label={t("Order:order_type")}
                multiple
                size="small"
                renderValue={(selected: number[]) => {
                  const labels = selected
                    .map(
                      (id) =>
                        orderTypeList?.find((opt: OrderType) => opt.id === id)?.label
                    )
                    .filter(Boolean);
                  const [first, ...rest] = labels;
                  return rest.length > 0 ? `${first} (+${rest.length} more)` : first || "";
                }}
                MenuProps={{ disableAutoFocusItem: true }}
              >
                {/* Search Box */}
                <MenuItem
                  disableRipple
                  disableTouchRipple
                  disableGutters
                  onClick={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={t("OrderType:order_type")}
                    value={searchOrderType}
                    onChange={(e) => setSearchOrderType(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  />
                </MenuItem>

                {/* Total selection count */}
                {!!orderType?.length && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t("Order:selected")}: {field.value?.length || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => reset({ ...watch(), orderType: [] })}
                    >
                      {t("Order:clear_all")}
                    </Typography>
                  </Box>
                )}

                {/* Filtered Options */}
                {filteredOrderTypeOptions?.map((option: OrderType) => (
                  <MenuItem key={option.id} value={option.id}>
                    <Checkbox checked={field.value?.includes(option.id)} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}

                {/* No match fallback */}
                {filteredOrderTypeOptions?.length === 0 && (
                  <MenuItem disabled>{t("Order:no_results_found")}</MenuItem>
                )}
              </Select>
            )}
          />
        </FormControl>


        {/* Buttons */}
        <Box display="flex" gap={1}>
          <Button type="submit" variant="contained" size="small"
          // disabled={!isAnyFilterApplied || !isDirty}
          >
            {t("Order:apply")}
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={handleClear}
            disabled={!isAnyFilterApplied || !isDirty}
          >
            {t("Order:clear")}
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: "100%", textAlign: "end" }}>


        <Button
          disabled={orderList?.length === 0}
          onClick={() => { exportOrders(); }}
          startIcon={<Export size={20} weight="regular" />}
        >
          Export
        </Button>    </Box>
    </LocalizationProvider>
  );
}