import React, { useEffect, useState } from "react";
import { GratuityRule } from "@/models/gratuity.model";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Check, X } from "@phosphor-icons/react";
import { toast } from "sonner";

import { useDialog } from "@/hooks/use-dialog";
import { useGratuity } from "@/hooks/use-gratuity";

import { ColumnDef, DataTable } from "../core/data-table";
import FallbackLoader from "../fallback-loader/loader";
import { GratuityDetailPopup } from "./gratuities-details";

interface GratuityProps {
	menuId: number;
}
const Gratuities: React.FC<GratuityProps> = ({ menuId }) => {
	const [selectedGratuity, setSelectedGratuity] = useState<GratuityRule | null>();

	const { handleOpen, handleClose, open } = useDialog();

	const openGratuityPopup = (event: React.MouseEvent, data: GratuityRule): void => {
		setSelectedGratuity(data);
		handleOpen();
	};

	const handelGratuityDetailsModal = (): void => {
		handleClose();
		setSelectedGratuity(null);
	};

	const { gratuityData, isLoading, error } = useGratuity(menuId);
    useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);
	const columns: ColumnDef<GratuityRule>[] = [
		{
			name: "Name",
			width: "200px",
			formatter: (row: GratuityRule): React.JSX.Element => (
				<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
					{row?.name || "-"}
				</Typography>
			),
		},
		{
			name: `Inherited from (${gratuityData?.category || "Category"})`,
			width: "200px",
			formatter: (row: GratuityRule): React.JSX.Element => (
				<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
					{row?.status === 1 ? <Check size={24} /> : <X size={24} />}
				</Typography>
			),
		},
	];

	if (isLoading) {
		return <FallbackLoader />;
	}
	return (
		<Box sx={{ mt: 2 }}>
			<DataTable columns={columns} rows={gratuityData?.categoryGratuity ?? []} onClick={openGratuityPopup} />
			{gratuityData?.categoryGratuity?.length === 0 || error && (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						No Gratuity found
					</Typography>
				</Box>
			)}
			{open && selectedGratuity?.id && (
				<GratuityDetailPopup open={open} close={handelGratuityDetailsModal} gratuityId={selectedGratuity?.id} />
			)}
		</Box>
	);
};

export default Gratuities;
