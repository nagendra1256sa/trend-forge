import type * as React from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";

import { appConfig } from "@/config/app";
import ReportsDashboard from "@/components/dashboard/overview/reports";

export const metadata = { title: `Overview | Dashboard | ${appConfig.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {


	return (
		<Box
			sx={{
				maxWidth: "var(--Content-maxWidth)",
				m: "var(--Content-margin)",
				// p: "var(--Content-padding)",
				width: "var(--Content-width)",
			}}
		>
			<Stack spacing={4}>
				<ReportsDashboard/>
			</Stack>
		</Box>
	);
}
