import React, { useCallback, useMemo, useState } from "react";
import { Box, Button, Container, Modal, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Image, X } from "@phosphor-icons/react";
import FallbackLoader from "../fallback-loader/loader";
import TaxRules from "./tax-rules";
import { useDialog } from "@/hooks/use-dialog";
import { MenuItemEdit } from "./menu-item-edit";
import Gratuities from "./gratuities";
import { useTranslation } from "react-i18next";
import { MenuItem } from "@/models/menu-item.model";

interface ModalProps {
	openModal: boolean;
	close: () => void;
	data:  MenuItem;
	loading: boolean;
	onUpdate:() => void;
	onFetchList:()=>void;
}

const tabs = [
	{ label: "General", value: "" },
	{ label: "Taxrules", value: "taxrules" },
	{ label: "Gratuities", value: "gratuities" },
] as const;

const MenuDetailModal: React.FC<ModalProps> = ({ openModal, close, data, loading,onUpdate,onFetchList}) => {

	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState<string>("");
    const {handleOpen, handleClose, open} = useDialog();
	const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue);
	}, [])
	const handleEditOpen = (): void => {
		setActiveTab("");
		handleOpen();
	}
	const handleDetailsClose = (): void => {
		close();
		setActiveTab("");
	}
	// todo: multiple time function invoked
	const tabContent = useMemo(() => {
		switch (activeTab) {
			case "": {
				return (
					<Box sx={{ pt: 5 }}>
						<Stack direction="row" justifyContent="space-between">
							<Stack spacing={2}>
								<Typography>
									<strong>{t("menuItem:menu_item_type")}:</strong> {data?.productType ==1 ? 'Condiment': 'Regular'}
								</Typography>
								<Typography>
									<strong>{t("menuItem:price")}:</strong>$ {data?.sellingPrice || "N/A"}
								</Typography>
							</Stack>

							<Stack>
								<Box>
									{data?.image ? (
										<img
											src={data?.image}
											alt="Menu Item"
											style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover" }}
										/>
									) : (
										<Image size={90} />
									)}
								</Box>
							</Stack>
						</Stack>
					</Box>
				);
			}
			case "taxrules": {
				return <TaxRules menuId={data?.id} />;
			}
			case "gratuities": {
				return (
					<Gratuities menuId={data?.id}/>
				);
			}
			default: {
				return null;
			}
		}
	}, [activeTab, data?.id, data?.sellingPrice, data?.image]);

	return (
		<><Modal open={openModal} onClose={handleDetailsClose} aria-labelledby="menu-details-title" aria-describedby="menu-details-description">
			<Container
				maxWidth="md"
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
          minHeight:"65vh",
				}}
			>
				<Paper
					sx={{
						width: "100%",
						p: 4,
						borderRadius: 2,
						boxShadow: 6,
						outline: "none",
						maxHeight: "90vh",
            minHeight:"65vh",
						overflow: "auto",
					}}
				>
					{loading ? (
                        <FallbackLoader />
					) : (
						<>
							<Stack direction="row" justifyContent={"space-between"} sx={{ mb: 2 }}>
								<Stack>
									<Typography variant="h5">
										<strong>{data?.label || "N/A"}</strong>
									</Typography>
									<Typography color="text.secondary">{data?.sku || "N/A"}</Typography>
								</Stack>
								<Stack direction="row" spacing={2}>
									<Button color="primary" onClick={handleEditOpen}>{t("menuItem:edit")}</Button>
									<Button onClick={handleDetailsClose} color="secondary">
										<X size={24} />
									</Button>
								</Stack>
							</Stack>
							<Tabs
								value={activeTab}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
								sx={{ borderBottom: 1, borderColor: "divider",}}
							> 

							{/** Add optional chain */}
							
								{tabs?.map((tab) => (
									<Tab key={tab?.value} label={tab?.label} value={tab?.value} sx={{ minHeight: "auto" }} />
								))}
							</Tabs>

							{tabContent}
						</>
					)}
				</Paper>
			</Container>
		</Modal>
		{
           open && <MenuItemEdit open={open} close={handleClose} menuItemData={data} onFetchList={onFetchList} onUpdateId={onUpdate}/>
		}</>
	);
};

export default MenuDetailModal;