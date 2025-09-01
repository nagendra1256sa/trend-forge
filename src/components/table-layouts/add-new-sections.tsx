import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const AddSectionSchema = z.object({
  name: z.string().min(1, { message: "Section name is required" }),
  description: z.string().optional(),
});

export type AddSectionFormData = z.infer<typeof AddSectionSchema>;

interface AddSectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddSectionFormData) => void;
}

export function AddSectionDialog({ open, onClose, onSubmit }: AddSectionDialogProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<AddSectionFormData>({
    resolver: zodResolver(AddSectionSchema),
    mode: "onChange",  // enables real-time validation
    defaultValues: {
      name: "",
      description: "",
    },
  });

    const handleCancelAddSection = (): void => {
        reset();
        onClose();
    };
    const handleAddSection = (data: AddSectionFormData): void => {
        onSubmit(data);
        reset();
        onClose();
    };
  return (
    <Dialog open={open} onClose={handleCancelAddSection} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Section</DialogTitle>
      <form onSubmit={handleSubmit(handleAddSection)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Section Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                error={!!errors.description}
                helperText={errors.description?.message}
                size="small"
                fullWidth
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!isValid}>
            Add Section
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
