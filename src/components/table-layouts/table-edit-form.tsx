import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { z as zod } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormHelperText
} from '@mui/material';
import { SectionLayout, TableDetails } from '@/models/table-layout';
import { statusArray } from '@/constants/table-layouts';
import { StarFour } from '@phosphor-icons/react';

// Zod validation schema
const tableSchema = zod.object({
    Table_Name: zod
        .string()
        .min(1, "Table name is required"),
    Capacity: zod.coerce
        .number()
        .min(1, "Capacity must be at least 1"),
    Section: zod.number().min(1, "Section is required"),
    VIP_Table: zod.boolean(),
    status: zod.number().optional(),
    x: zod.number().optional(),
    y: zod.number().optional(),
    shape: zod.string().optional(),
});

type TableFormData = zod.infer<typeof tableSchema>;

export interface TableData {
    Table_Name: string;
    Capacity: number;
    Section: number;
    VIP_Table: boolean;
    status: number;
    x: number;
    y: number;
    shape: string;
}

interface TableEditFormProps {
    tableId: number | string;
    initialTableData: Partial<TableDetails> | null;
    adjustedPoints: { x: number | null, y: number | null },
    sections: SectionLayout[];
    onSuccess: (tableId: number | string, data: TableData) => Promise<void>;
    onDelete: (id: number | string) => Promise<void>;
    layOutId: number;
}

const TableEditForm: React.FC<TableEditFormProps> = ({
    tableId,
    initialTableData,
    adjustedPoints,
    sections,
    onSuccess,
    onDelete,
    layOutId
}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const tableIdRef = useRef<number | string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        formState: { errors }
    } = useForm<TableFormData>({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            Table_Name: '',
            Capacity: 4,
            Section: layOutId,
            VIP_Table: false,
            status: 1,
            x: 0,
            y: 0,
            shape: 'round'
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (initialTableData && tableId !== tableIdRef.current) {
            reset({
                Table_Name: initialTableData.name || '',
                Capacity: initialTableData.seats || 4,
                Section: layOutId,
                VIP_Table: initialTableData.isVipTable || false,
                status: initialTableData.status || 1,
                x: Number(adjustedPoints?.x) || 0,
                y: Number(adjustedPoints?.y) || 0,
                shape: initialTableData.shape || 'round'
            });
            tableIdRef.current = tableId;
        }
    }, [tableId, initialTableData, layOutId, reset]);

    const onSubmit = () => {
        setOpenUpdateDialog(true);
    };


    const confirmUpdate = async () => {
        setOpenUpdateDialog(false);
        setLoading(true);
        try {
            // Use getValues() instead of control._formValues for safer access
            const formData = getValues() as TableData;
            await onSuccess(tableId, formData);
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setOpenDeleteDialog(false);
        setLoading(true);
        try {
            await onDelete(tableId!);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenUpdateDialog(false);
        setOpenDeleteDialog(false);
    };

    if (!tableId) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3, minHeight: '219px' }}>
                No table selected
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Controller
                        name="Table_Name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Table Name"
                                error={!!errors.Table_Name}
                                helperText={errors.Table_Name?.message}
                                disabled={initialTableData?.status === 3}
                                inputProps={{ maxLength: 50 }} // Increased from 5 to be more practical
                                size="small"
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        name="Capacity"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Capacity"
                                type="number"
                                error={!!errors.Capacity}
                                disabled={initialTableData?.status === 3}
                                helperText={errors.Capacity?.message}
                                inputProps={{ min: 1, max: 20 }}
                                size="small"
                                fullWidth

                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value === '' ? '' : Number.parseInt(value) || '');
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="Section"
                        control={control}
                         disabled={initialTableData?.status === 3}
                        render={({ field }) => (
                            <FormControl size="small" fullWidth error={!!errors.Section}>
                                <InputLabel>Section</InputLabel>
                                <Select
                                    {...field}
                                    label="Section"
                                   
                                >
                                    {sections.map(section => (
                                        <MenuItem key={section.id} value={section.id}>
                                            {section.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.Section && (
                                    <FormHelperText error>
                                        {errors.Section.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="status"
                        control={control}
                         disabled={initialTableData?.status === 3}
                        render={({ field }) => (
                            <FormControl size="small" fullWidth error={!!errors.status}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    {...field}
                                    label="Status"
                                    disabled={initialTableData?.status === 3}
                                >
                                    {statusArray.map(status => (
                                        <MenuItem key={status.value} value={status.value}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.status && (
                                    <FormHelperText error>
                                        {errors.status.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="VIP_Table"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value || false} // Added fallback for undefined
                                        disabled={initialTableData?.status === 3}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <StarFour size={16} color="#FFD700" />
                                        VIP Table
                                    </Box>
                                }
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            type="submit"
                            size="small"
                            variant="contained"
                            sx={{ flexGrow: 1 }}
                            disabled={!!errors.Table_Name || !!errors.Capacity || loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Update'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={handleDeleteClick}
                            sx={{ flexGrow: 1 }}
                            disabled={loading}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </form>

            <Dialog open={openUpdateDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to update this table?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={confirmUpdate} color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this table?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TableEditForm;