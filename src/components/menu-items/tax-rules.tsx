'use client'
import React, { useEffect, useState } from "react";
import { CategoryTaxRule } from "@/models/tax-rule.model";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Check, X } from "@phosphor-icons/react";
import { toast } from "sonner";

import { useDialog } from "@/hooks/use-dialog";
import { useTaxRuleByBcId } from "@/hooks/use-taxrules";

import { ColumnDef, DataTable } from "../core/data-table";
import FallbackLoader from "../fallback-loader/loader";
import TaxRuleDetails from "./tax-rule-details";

interface TaxRulesProps {
	menuId: number;
}
const TaxRules: React.FC<TaxRulesProps> = ({ menuId }) => {
	const { taxData, isLoading, error } = useTaxRuleByBcId(menuId);
	const [selectedTaxRule, setSelectedTaxRule] = useState<CategoryTaxRule | null>(null);

	const { handleOpen, handleClose, open } = useDialog();

	const openTaxRule = (event: React.MouseEvent, data: CategoryTaxRule): void => {
		setSelectedTaxRule(data);
		handleOpen();
	};

	const handelCloseTaxRuleDetailsModel = (): void => {
		handleClose();
		setSelectedTaxRule(null);
	};
	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);
	const columns: ColumnDef<CategoryTaxRule>[] = [
		{
			name: "Name",
			width: "200px",
			formatter: (row: CategoryTaxRule): React.JSX.Element => (
				<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
					{row?.name || "-"}
				</Typography>
			),
		},
		{
			name: "Code",
			width: "150px",
			formatter: (row: CategoryTaxRule): React.JSX.Element => (
				<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
					{row?.code ?? "-"}
				</Typography>
			),
		},
		{
			name: `Inherited from (${taxData?.category || "Category"})`,
			width: "200px",
			formatter: (row: CategoryTaxRule): React.JSX.Element => (
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
		<>
			<Box sx={{ mt: 2 }}>
				<DataTable columns={columns} rows={taxData?.categoryTaxRules ?? []} onClick={openTaxRule} />
				{taxData?.categoryTaxRules?.length === 0 || error && (
					<Box sx={{ p: 3 }}>
						<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
							No Tax Rules found
						</Typography>
					</Box>
				)}
			</Box>
			{open && (
				<TaxRuleDetails
					open={open}
					close={handelCloseTaxRuleDetailsModel}
					taxId={selectedTaxRule?.id}
					key={selectedTaxRule?.id}
				/>
			)}
		</>
	);
};

export default TaxRules;
