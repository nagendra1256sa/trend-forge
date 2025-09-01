"use client";

import type * as React from "react";

import { dashboardConfig } from "@/config/dashboard";
import { useSettings } from "@/components/core/settings/settings-context";
import { HorizontalLayout } from "@/components/dashboard/layout/horizontal/horizontal-layout";
import { VerticalLayout } from "@/components/dashboard/layout/vertical/vertical-layout";
import { Box, Typography } from "@mui/material";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout(props: LayoutProps): React.JSX.Element {
	const { settings } = useSettings();
	const layout = settings.dashboardLayout ?? dashboardConfig.layout;

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Box sx={{ flexGrow: 1 }}>
				{layout === "horizontal" ? (
					<HorizontalLayout {...props} />
				) : (
					<VerticalLayout {...props} />
				)}
			</Box>

			<Box
				component="footer"
				sx={{
					width: '100%',
					py: 2,
					textAlign: 'center',
					borderTop: '1px solid #e0e0e0',
					bgcolor: 'background.default',
					pl: { xs: 0, md: '280px' }, 
				}}
			>
				<Typography variant="body2" color="text.secondary">
					All rights reserved. Powered by <strong>Chefgaa</strong>
				</Typography>
			</Box>

		</Box>
	);
}