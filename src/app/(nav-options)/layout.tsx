"use client";

import type * as React from "react";
import { VerticalLayout } from "@/components/dashboard/layout/vertical/vertical-layout";
import { Box } from "@mui/material";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout(props: LayoutProps): React.JSX.Element {
	

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Box sx={{ flexGrow: 1 }}>
				
					<VerticalLayout {...props} />
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
				{/* <Typography variant="body2" color="text.secondary">
					All rights reserved. Powered by <strong>Chefgaa</strong>
				</Typography> */}
			</Box>

		</Box>
	);
}