'use client';
import FallbackLoader from '@/components/fallback-loader/loader';
import { useGetReports } from '@/hooks/dashboard-hooks/use-get-reports';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ArrowLeft } from '@phosphor-icons/react';
import React, { useEffect } from 'react'
import { reportConfigs } from './reports';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

type ReportsViewProps = {
	reportType: string;
};
const handleBackToDashboard = (): void => {
	redirect(`/dashboard`);
};

const ReportsView: React.FC<ReportsViewProps> = ({ reportType }) => {

	const { reports, error, loading, getReportsUrl } = useGetReports(reportType);

	const fetchReport = async () => {
		try {
			await getReportsUrl();
		} catch (error: any) {
			toast.error('Oops something went wrong..!', error)
		}
	};


	useEffect(() => {
		fetchReport();
	}, [reportType])

	useEffect(() => {
		if (error) {
			toast.error('Oops something went wrong...!');
		}
	}, [error])



	//    const handleBackToDashboard = (): void => {
	// 		redirect(`/dashboard`);
	// 	};

	return (
		<>
			{
				!reports && loading && <FallbackLoader />
			}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<AppBar position="static" color="default" elevation={1}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleBackToDashboard} sx={{ mr: 2 }}>
							<ArrowLeft size={24} />
						</IconButton>
						<Typography variant="h6" sx={{ flexGrow: 1 }}>
							{reportConfigs.find(r => r.key === reportType)?.title}
						</Typography>
					</Toolbar>
				</AppBar>

				<Box sx={{ flex: 1 }}>
					<iframe src={reports} width="100%" height="545" loading="lazy" style={{ border: 'none' }} title={reportType} />
				</Box>
			</Box>
		</>
	);
}

export default ReportsView;