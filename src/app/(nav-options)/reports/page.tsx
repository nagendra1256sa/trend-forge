import React from 'react'
import type { Metadata } from "next";
import { appConfig } from "@/config/app";
import { Box, Stack } from '@mui/system';
import ReportsSummary from '@/components/dashboard/reports/reports-summary';

export const metadata = { title: `Overview | Dashboard | ${appConfig.name}` } satisfies Metadata;
const page = () => {
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
                <ReportsSummary />
			</Stack>
		</Box>
  )
}

export default page
