"use client";

import type * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useBusinessCenterNode } from "@/hooks/use-bussinesscenters";
import { useBusinessCenter } from "@/contexts/businesscenter-context";

export const workspaces = [
	{ name: "DD", avatar: "/assets/DD-Logo.png" },
] satisfies Workspaces[];

export interface Workspaces {
	name: string;
	avatar: string;
}

export interface WorkspacesPopoverProps {
	anchorEl: null | Element;
	onChange?: (tenant: number) => void;
	onClose?: () => void;
	open?: boolean;
}

export function WorkspacesPopover({
	anchorEl,
	onChange,
	onClose,
	open = false,
}: WorkspacesPopoverProps): React.JSX.Element {
	const { data } = useBusinessCenterNode();
	const { setSelectedBCId, selectedBCId } = useBusinessCenter();

	const handleWorkspaceSelect = (workspaceId: number) => {
		setSelectedBCId(workspaceId);
		onChange?.(workspaceId);
		onClose?.();
	};

	return (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={open}
			slotProps={{ paper: { sx: { width: "250px", height: "auto" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			{data?.map((workspace) => (
				<MenuItem
					key={workspace.id}
					selected={workspace.id === selectedBCId}
					onClick={() => handleWorkspaceSelect(workspace.id)}
				>
					{workspace.label}
				</MenuItem>
			))}
		</Menu>
	);
}

