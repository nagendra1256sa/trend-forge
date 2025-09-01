'use client';

import React, { useEffect, useState } from "react";
import { NewSectionBinder } from "@/constants/table-layouts";
import { SectionLayout } from "@/models/table-layout";
import {
	Button,
	Card,
	Grid,
	Typography,
	Box
} from "@mui/material";
import { ForkKnife } from "@phosphor-icons/react";
import { toast } from "sonner";

import { useAddNewSection } from "@/hooks/table-layouts-hooks/use-add-new-section";
import { useGetLayouts } from "@/hooks/table-layouts-hooks/use-get-sections";

import FallbackLoader from "../fallback-loader/loader";
import { useRouter } from "next/navigation";
import { AddSectionDialog } from "./add-new-sections";
import { useTranslation } from "react-i18next";
import { useHeaderTitle } from "@/hooks/header-title";

// interface ConfirmDialogState {
// 	open: boolean;
// 	tableId: number | null;
// 	tableName: string;
// }

const TableSections = (): React.JSX.Element => {
	const router = useRouter();
	const { layoutSections = [], loading, refetch: getLayouts } = useGetLayouts();

	// const [currentSection, setCurrentSection] = useState<SectionLayout | null>(null);
	// const [showSections, setShowSections] = useState<boolean>(false);

	const [addSectionDialog, setAddSectionDialog] = useState<boolean>(false);
	const { t } = useTranslation();
	const { setHeaderTitle } = useHeaderTitle();

	const {
		newSection,
		error: addNewSectionError,
		loading: addNewSectionLoading,
		reFetch: addNewSectionRefetch,
	} = useAddNewSection();

	const handleSectionSelect = (section: SectionLayout): void => {
		// setCurrentSection(section);
		// setShowSections(false);
		router.push(`/table-layouts/${section?.id}`);
	};

	// Auto-navigate if only one section exists
	useEffect(() => {
		if (!loading && layoutSections && layoutSections.length === 1) {
			const singleSection = layoutSections[0];
			handleSectionSelect(singleSection);
		}
	}, [layoutSections, loading]);

	useEffect(() => {
		setHeaderTitle(t('TableLayouts:table_layouts'));
		if (addNewSectionError) {
			switch (addNewSectionError) {
				case "error_table_layout_already_exist_for_bc": {
					toast.error("A table layout already exists for this business center.");
					break;
				}
				case "error_table_already_exist_with_same_name": {
					toast.error("A table with the same name already exists.");
					break;
				}
				default: {
					toast.error("Something went wrong. Please try again.");
				}
			}
		}
	}, [addNewSectionError]);

	const openAddSectionDialog = () => {
		setAddSectionDialog(true);
	};

	useEffect(() => {
		if (newSection) {
			setAddSectionDialog(false);
			toast.success("New section added successfully");
			getLayouts();
		}
	}, [addNewSectionLoading, newSection, getLayouts]);

	const handleCancelAddSection = (): void => {
		setAddSectionDialog(false);
	};

	const handleAddSection = (value: any) => {
		const payLoad = NewSectionBinder.bind(value);
		try {
			addNewSectionRefetch(payLoad);
		} catch (error) {
			console.error(error);
		}
	};

	if (loading) {
		return <FallbackLoader />;
	}

	if (layoutSections && layoutSections.length === 1) {
		return <FallbackLoader />;
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ p: 3 }}>
				<Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
					Restaurant Section(s)
				</Typography>

				<Typography variant="subtitle1" sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}>
					Choose a section to view and manage tables
				</Typography>

				{layoutSections && layoutSections.length > 1 ? (
					<Grid container spacing={3}>
						{layoutSections.map((section) => (
							<Grid item xs={12} sm={6} md={4} key={section.id}>
								<Card
									onClick={() => handleSectionSelect(section)}
									sx={{
										p: 4,
										textAlign: "center",
										cursor: "pointer",
										height: "200px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
										color: "white",
										borderRadius: "16px",
										transition: "all 0.3s ease",
										"&:hover": {
											transform: "translateY(-8px)",
											boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
										},
									}}
								>
									<ForkKnife size={48} style={{ marginBottom: "16px" }} />
									<Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
										{section?.name || "-"}
									</Typography>
									<Typography variant="body2" sx={{ opacity: 0.9 }}>
										Click to view tables
									</Typography>
								</Card>
							</Grid>
						))}
					</Grid>
				) : (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							minHeight: "300px",
							textAlign: "center",
							p: 4,
						}}
					>
						<ForkKnife size={80} color="#9e9e9e" style={{ marginBottom: "16px" }} />
						<Typography variant="h5" sx={{ mb: 2, color: "text.secondary", fontWeight: "medium" }}>
							No Restaurant Tables Found
						</Typography>
						<Button variant="contained" onClick={openAddSectionDialog}>
							Create Section
						</Button>
					</Box>
				)}

				{addSectionDialog && (
					<AddSectionDialog open={addSectionDialog} onClose={handleCancelAddSection} onSubmit={handleAddSection} />
				)}
			</Box>
		</Box>
	);
};

export default TableSections;