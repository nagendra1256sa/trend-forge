import React, { useEffect } from "react";
import {
  Container,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  Button,
  Grid,
  Box,
  FormHelperText,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { X as XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { MenuEditProps } from "@/types/menu";
import { Option } from "@/components/core/option";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMenuUpdate } from "@/hooks/menu-items-hooks/use-update-menu";
import FallbackLoader from "../fallback-loader/loader";
import { toast } from "sonner";
import { z } from "zod";
import { useMasterJson } from "@/hooks/use-master-json";
import { useTranslation } from "react-i18next";

export const schema = z.object({
  Label: z.string().min(1, { message: "Name is required" }),
  BasePrice: z.preprocess(
    (val) => {
      // if (val === "" || val === null || val === undefined) return undefined;
      if (val === "" || val === null) return;
      const parsed = Number.parseFloat(val as string);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
    z.number({ required_error: "Base price is required" }).nonnegative({ message: "Base price must be positive" })
  ),

  SellingPrice: z.preprocess(
    (val) => {
      // if (val === "" || val === null || val === undefined) return undefined;
      if (val === "" || val === null) return;
      const parsed = Number.parseFloat(val as string);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
    z.number({ required_error: "Selling price is required" }).positive({ message: "Selling price must be greater than 0" })
  ),

  Description: z.string().optional(),
  CondimentType: z.string().min(1, { message: "Condiment Type is required" }),
  Status: z.union([z.string().min(1, { message: "Status is required" }), z.number()]),
});
const requiredFields = new Set(["Label", "BasePrice", "SellingPrice", "CondimentType", "Status"]);


export type MenuItemFormData = z.infer<typeof schema>;

function defaultValue(field: keyof MenuItemFormData): string | number {
  const defaults: Partial<MenuItemFormData> = {
    BasePrice: 0,
    SellingPrice: 0,
    Status: 1,
  };
  return defaults[field] ?? "";
}

export function MenuItemEdit({ open, close, menuItemData, onFetchList, onUpdateId }: MenuEditProps): React.JSX.Element {
  const { loading, fetchMenuItems, error: err, menuItem } = useMenuUpdate();
  const { masterJson } = useMasterJson();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      Label: menuItemData?.label ?? "",
      BasePrice: menuItemData?.basePrice ?? 0,
      SellingPrice: menuItemData?.sellingPrice ?? 0,
      Description: menuItemData?.description ?? "",
      CondimentType: "",
      Status: menuItemData?.status ?? "Active",
    },
  });

  const onSubmit = async (formData: any) => {
    await fetchMenuItems(formData, menuItemData?.id);
  };
  useEffect(() => {
    if (err) {
      toast.error(err);
      close();
    } else if (menuItem) {
      onFetchList();
      onUpdateId();
      close();
    }
  }, [err, menuItem]);


  useEffect(() => {
    reset({
      Label: menuItemData?.label ?? "",
      BasePrice: menuItemData?.basePrice ?? 0,
      SellingPrice: menuItemData?.sellingPrice ?? 0,
      Description: menuItemData?.description ?? "",
      CondimentType: "Optional",
      Status: menuItemData?.status ?? 1,
    });
  }, [menuItemData, reset]);

  const fields: { label: string; name: keyof MenuItemFormData }[] = [
    { label: "Name", name: "Label" },
    { label: "Base Price", name: "BasePrice" },
    { label: "Selling Price", name: "SellingPrice" },
    { label: "Description", name: "Description" },
  ];

  return (
    <>
      {loading && <FallbackLoader />}
      <Modal open={open} onClose={close} aria-labelledby="menu-details-title">
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            py: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxHeight: "90vh",
              borderRadius: 2,
              boxShadow: 6,
              outline: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 3, pb: 0, flexShrink: 0 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{t("menuItem:edit_menu_item")}</Typography>
                <IconButton onClick={close}>
                  <XIcon />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", px: 3, py: 2 }}>
              <form id="menu-edit-form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {fields.map(({ label, name }) => (
                    <Grid item xs={12} md={6} key={name}>
                      <FormControl fullWidth error={!!errors[name]}>
                        <InputLabel>
                          {label}{requiredFields.has(name) && <span style={{ color: "red" }}> *</span>}
                        </InputLabel>
                        <OutlinedInput
                          label={label}
                          type={typeof defaultValue(name) === "number" ? "number" : "text"}
                          inputProps={typeof defaultValue(name) === "number" ? { step: "any" } : {}}
                          {...register(name)}
                        />
                        {errors[name] && (
                          <FormHelperText>{errors[name]?.message?.toString()}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  ))}

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.CondimentType}>
                      <InputLabel>{t("menuItem:condiment_type")}</InputLabel>
                      <Controller
                        control={control}
                        name="CondimentType"
                        render={({ field }) => (
                          <Select label="Condiment Type" {...field}>
                            <Option value="Optional">{t("menuItem:optional")}</Option>
                            <Option value="Mandatory">{t("menuItem:mandatory")}</Option>
                          </Select>
                        )}
                      />
                      {errors.CondimentType && (
                        <FormHelperText>{errors.CondimentType.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.Status}>
                      <InputLabel>{t("menuItem:status")}<span style={{ color: "red" }}> *</span></InputLabel>
                      <Controller
                        control={control}
                        name="Status"
                        render={({ field }) => (
                          <Select label="Status" {...field}>
                            {masterJson?.status?.map((element: any) => (
                              <Option value={element?.key} key={element?.key}>
                                {element?.value}
                              </Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.Status && (
                        <FormHelperText>{errors.Status.message?.toString()}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </Box>

            <Box sx={{ p: 3, pt: 2, flexShrink: 0, borderTop: 1, borderColor: "divider" }}>
              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" variant="contained" form="menu-edit-form" disabled={!isDirty}>
                  {t("menuItem:save")}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Modal>
    </>
  );
}
