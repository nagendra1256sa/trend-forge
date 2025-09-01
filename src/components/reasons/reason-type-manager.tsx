import { Box, Button, Container, FormControl, FormHelperText, InputLabel, Modal, OutlinedInput, Paper, Select, Stack, Typography } from "@mui/material";
import { X } from "@phosphor-icons/react";
import Grid from "@mui/material/Grid2";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Option } from "@/components/core/option";
import { useReasonType } from "@/hooks/reasons/get-reason-type";
import FallbackLoader from "../fallback-loader/loader";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReasonInputs } from "@/models/reasons";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { useCreateReason } from "@/hooks/reasons/use-create-reason";
import { useGetReasonById } from "@/hooks/reasons/get-reason-byid";
import { useUpdateReason } from "@/hooks/reasons/use-update-reason";
import { PageType } from "@/constants/reasons";

interface ReasonTypeManagerProps {
    pageType: string;
    open: boolean;
    close: (isRefetch?: boolean) => void;
    reasonId?: number | null;
}

interface FormDta {
    reasonTitle: string;
    reasonType: number;
    description: string;
    status?: number;
}

// const schema = zod.object({
//     reasonTitle: zod.string().min(1, "Reason title is required"),
//     reasonType: zod.string().min(1, "Reason type is required"),
//     description: zod.string().optional(),
//     status: zod.number().min(1, "Status is required"),
// })

const createSchema = (pageType: string) => {
  const baseSchema = {
    reasonTitle: zod.string().trim().min(1, "Reason title is required"),
    reasonType: zod.number().min(1, "Reason type is required"),
    description: zod.string().optional(),
  };

    if (pageType === PageType.Edit) {
    return zod.object({
      ...baseSchema,
      status: zod.number().min(1, "Status is required"),
    });
  }

  return zod.object(baseSchema);
};

const statusOptions = [
    { id: 1, label: "Active" },
    { id: 2, label: "Inactive" },
];

export const ReasonTypeManager: React.FC<ReasonTypeManagerProps> = ({ pageType, open, close, reasonId }) => {
    const { reasonType, loading } = useReasonType();
    const {selectedBCId} = useBusinessCenter();
    const {createNewReason, loading: createLoading, isReasonCreated} = useCreateReason();
    const {reason, loading: reasonLoading} = useGetReasonById(reasonId ?? 0);
    const schema = createSchema(pageType);
    const {updateReason, loading: updateLoading,isReasonUpdated} = useUpdateReason();

    const defaultValues: FormDta = {
        reasonTitle: "",
        reasonType: 0,
        description: "",
        status: 1,
    };

    const { control,
         formState: { errors, isValid },
          handleSubmit,
          reset
          
        } = useForm<FormDta>({
        defaultValues,
        resolver: zodResolver(schema),
        mode: "onChange",
    });

     useEffect(() => {
      if (reason) {
        reset({
          reasonTitle: reason.Reason,
          reasonType: reason.ReasonType,
          description: reason.Description,
          status: reason.Status
        })
      }
    }, [reason]);

    useEffect(() => {
      if (isReasonUpdated || isReasonCreated) {
        close(true);
        reset();
      }
    }, [isReasonUpdated,isReasonCreated]);


    const onSubmit = (data: FormDta) => {

        const reasonInputsObj = new ReasonInputs();
         reasonInputsObj.updateFromForm(data);
         reasonInputsObj.NodeRef = selectedBCId ? selectedBCId : 0;
         reasonInputsObj.Status = data.status ? data.status : 1;
          if ((reason && !reason.Parent) || !reason) {
           reasonInputsObj.Parent = 0;
    }

        if (pageType === PageType?.Edit) {
           updateReason(reasonId ?? 0, reasonInputsObj);   
         } else {
            createNewReason(reasonInputsObj);
         }
    };

    return (
        <Modal
            open={open}
            onClose={() => close(false)}
            aria-labelledby="edit-employee-title"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "auto"
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                }}
            >
                <Paper
                    sx={{
                        width: "100%",
                        p: { xs: 2, md: 4 },
                        borderRadius: 2,
                        boxShadow: 6,
                        maxHeight: "90vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {(loading || updateLoading || reasonLoading || createLoading) && <FallbackLoader />}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={3}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            {pageType === 'edit' ? 'Edit Reason' : 'Create Reason'}
                        </Typography>
                        <Button
                            onClick={() => close(false)}
                            color="secondary"
                            sx={{ minWidth: 'unset', p: 1 }}
                        >
                            <X size={22} />
                        </Button>
                    </Stack>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ flex: 1 }}>
                        <Grid container spacing={3}>
                            {/* Reason Title */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    control={control}
                                    name="reasonTitle"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors?.reasonTitle)} fullWidth>
                                            <InputLabel required>Reason Title</InputLabel>
                                            <OutlinedInput {...field} type="text" />
                                            {errors.reasonTitle && (
                                                <FormHelperText>{errors.reasonTitle.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            {/* Reason Type */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Controller
                                    control={control}
                                    name="reasonType"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors?.reasonType)} fullWidth>
                                            <InputLabel required>Reason Type</InputLabel>
                                            <Select {...field}>
                                                {reasonType?.map((reasonType) => (
                                                    <Option key={reasonType?.ID} value={reasonType?.ID}>
                                                        {reasonType?.Type}
                                                    </Option>
                                                ))}
                                            </Select>
                                            {errors.reasonType && (
                                                <FormHelperText>{errors.reasonType.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>

                            {/* Status */}
                            {
                                pageType === 'edit' && (
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            control={control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormControl error={Boolean(errors?.status)} fullWidth>
                                                    <InputLabel required>Status</InputLabel>
                                                    <Select {...field}>
                                                        {statusOptions.map((status) => (
                                                            <Option key={status.id} value={status.id}>
                                                                {status.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                    {errors.status && (
                                                        <FormHelperText>{errors.status.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>

                                )
                            }

                            {/* Description */}
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormControl error={Boolean(errors?.description)} fullWidth>
                                            <InputLabel>Description</InputLabel>
                                            <OutlinedInput
                                                {...field}
                                                type="text"
                                                multiline
                                                rows={4}
                                            />
                                            {errors.description && (
                                                <FormHelperText>{errors.description.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{ mt: 4 }}
                        >
                            <Button
                                onClick={() => close(false)}
                                variant="outlined"
                                color="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={!isValid}
                            >
                                {pageType === 'edit' ? 'Update' : 'Create'}
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Modal>
    );
};