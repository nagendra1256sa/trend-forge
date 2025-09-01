"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CaretUpDown as CaretUpDownIcon } from "@phosphor-icons/react/dist/ssr/CaretUpDown";
import { usePopover } from "@/hooks/use-popover";
import { workspaces, WorkspacesPopover } from "./workspaces-popover";
import { useBusinessCenterNode } from "@/hooks/use-bussinesscenters";
import { useBusinessCenter } from "@/contexts/businesscenter-context";
import { useEffect } from "react";

export function WorkspacesSwitch(): React.JSX.Element {
	const popover = usePopover<HTMLDivElement>();
	const { data: businessCenters, loading } = useBusinessCenterNode();
	const { selectedBCId, setSelectedBCId } = useBusinessCenter(); // ✅ from context

	useEffect(() => {
		if (businessCenters && businessCenters.length > 0 && !selectedBCId) {
			setSelectedBCId(businessCenters[0].id);
		}
	}, [businessCenters, selectedBCId, setSelectedBCId]);

	const currentWorkspace = businessCenters?.find(ws => ws.id === selectedBCId);

	const handleWorkspaceChange = (workspaceId: number) => {
		setSelectedBCId(workspaceId);
		popover.handleClose();
	};

	return (
		<>
			<Stack
				direction="row"
				onClick={popover.handleOpen}
				ref={popover.anchorRef}
				spacing={2}
				sx={{
					alignItems: "center",
					border: "1px solid var(--Workspaces-border-color)",
					borderRadius: "12px",
					cursor: "pointer",
					p: "4px 8px",
				}}
			>
				<Avatar src={workspaces[0]?.avatar} variant="rounded" />
				<Box sx={{ flex: "1 1 auto" }}>
					<Typography color="var(--Workspaces-title-color)" variant="caption">
						Business Center
					</Typography>
					<Typography color="var(--Workspaces-name-color)" variant="subtitle2">
						{loading ? "Loading..." : currentWorkspace?.label || "No Selection"}
					</Typography>
				</Box>
				<CaretUpDownIcon color="var(--Workspaces-expand-color)" fontSize="var(--icon-fontSize-sm)" />
			</Stack>

			<WorkspacesPopover
				anchorEl={popover.anchorRef.current}
				onChange={handleWorkspaceChange}
				onClose={popover.handleClose}
				open={popover.open}
			/>
		</>
	);
}
