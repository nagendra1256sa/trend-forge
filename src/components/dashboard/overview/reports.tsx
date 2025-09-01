'use client';
import React, { useEffect } from 'react';
import {
	Box,
	Card,
	CardContent,
	CardActions,
	Button,
	Typography,
	Grid,
	Container,
} from '@mui/material';
import { Bank, CalendarBlank, ChartBar, ChartPie, ClipboardText, ForkKnife, Receipt, TrendUp } from '@phosphor-icons/react';
import { redirect } from 'next/dist/client/components/navigation';
import { useHeaderTitle } from '@/hooks/header-title';
import { useTranslation } from 'react-i18next';


const enum ReportKey {
	SalesDashboard = 'sales_dashboard',
	ItemSaleReport = 'item_sale_report',
	SalesOverview = 'sales_overview',
	TenderTypeSales = 'tender_type_sales',
	TaxReports = 'tax_reports',
	GratuityReports = 'gratuity_reports',
	CheckReports = 'check_reports',
	MenuItemReport = 'menu_item_report',
	DayClosureReport = 'day_closure_report',
	IncomeAuditReport = 'income_audit_report',
}

interface ReportConfig {
	key: ReportKey;
	title: string;
	description: string;
	icon: React.ReactNode;
	color: string;
};

export const reportConfigs: ReportConfig[] = [
	{
		key: ReportKey.SalesDashboard,
		title: 'Sales Dashboard',
		description: 'Overview of sales performance and metrics',
		icon: <ChartBar size={28} weight="fill" />,
		color: '#1976d2',
	},
	{
		key: ReportKey.ItemSaleReport,
		title: 'Item Sale Report',
		description: 'Detailed analysis of individual item sales',
		icon: <ChartBar size={28} weight="bold" />,
		color: '#388e3c',
	},
	{
		key: ReportKey.SalesOverview,
		title: 'Sales Overview',
		description: 'Comprehensive sales summary and trends',
		icon: <TrendUp size={28} weight="fill" />,
		color: '#f57c00',
	},
	{
		key: ReportKey.TenderTypeSales,
		title: 'Tender Type Sales',
		description: 'Sales breakdown by payment method',
		icon: <Bank size={28} weight="fill" />,
		color: '#7b1fa2',
	},
	{
		key: ReportKey.TaxReports,
		title: 'Tax Reports',
		description: 'Tax calculations and compliance reports',
		icon: <Receipt size={28} weight="fill" />,
		color: '#d32f2f',
	},
	{
		key: ReportKey.GratuityReports,
		title: 'Gratuity Reports',
		description: 'Gratuity tracking and distribution',
		icon: <ChartPie size={28} weight="fill" />,
		color: '#0288d1',
	},
	{
		key: ReportKey.CheckReports,
		title: 'Check Reports',
		description: 'Check processing and validation reports',
		icon: <CalendarBlank size={28} weight="fill" />,
		color: '#5d4037',
	},
	{
		key: ReportKey.MenuItemReport,
		title: 'Menu Item Report',
		description: 'Menu performance and popularity analysis',
		// eslint-disable-next-line react/jsx-no-undef
		icon: <ForkKnife size={28} weight="fill" />,
		color: '#e64a19',
	},
	{
		key: ReportKey.DayClosureReport,
		title: 'Day Closure Report',
		description: 'End of day reconciliation and closure',
		icon: <CalendarBlank size={28} weight="fill" />,
		color: '#455a64',
	},
	{
		key: ReportKey.IncomeAuditReport,
		title: 'Income Audit Report',
		description: 'Financial audit and income verification',
		icon: <ClipboardText size={28} weight="fill" />,
		color: '#6a1b9a',
	},
];
const handleViewReport = (reportType: string) => {
	redirect(`/dashboard/reports-view/${reportType}`)
}
export default function ReportsDashboard(): React.JSX.Element {
	const { setHeaderTitle } = useHeaderTitle();
	const { t } = useTranslation();

	//    const handleViewReport = (reportType: string) => {
	// 	 redirect(`/dashboard/reports-view/${reportType}`)
	//    }

	useEffect(() => {
		setHeaderTitle(t('OverView:reports_dashboard'));
	})

	return (
		<>
			<Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
				<Container maxWidth="xl" sx={{ py: 4 }}>
					<Box sx={{ textAlign: 'center', mb: 6 }}>
						<Typography variant="h3" gutterBottom fontWeight="bold">
							Reports Dashboard
						</Typography>
						<Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
							Access comprehensive reports and analytics for your business operations
						</Typography>
					</Box>

					<Grid container spacing={3}>
						{reportConfigs.map((report) => (
							<Grid item xs={12} sm={6} md={3} key={report.key}>
								<Card sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									transition: 'all 0.3s ease',
									'&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
								}}>
									<CardContent sx={{ flexGrow: 1 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
											{/* <Avatar sx={{ bgcolor: report.color, width: 48, height: 48 }}>
											{report.icon}
										</Avatar>
										<Chip label={`#${dashboardMapping[report.key]}`} size="small" color="primary" variant="outlined" /> */}
										</Box>

										<Typography variant="h6" fontWeight={600} gutterBottom>
											{report.title}
										</Typography>
										{/* <Typography variant="body2" color="text.secondary">
										{report.description}
									</Typography> */}
									</CardContent>

									<CardActions sx={{ p: 2, pt: 0 }}>
										<Button
											fullWidth
											variant="contained"
											onClick={() => handleViewReport(report.key)}
											color="primary"
										>
											View Report
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>
		</>
	);
}
