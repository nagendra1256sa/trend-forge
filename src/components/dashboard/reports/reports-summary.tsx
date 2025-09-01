'use client'
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { getReportsOverview } from "@/lib/api/reports.service";
import FallbackLoader from "@/components/fallback-loader/loader";

const ReportsSummary = () => {
	const [url, setUrl] = useState<string | undefined>();
	const [error, setError] = useState("");
	const [isLoading, setLoading] = useState(false);

	const getReportUrl = async (): Promise<void> => {
		setLoading(true);
		try {
			const response = await getReportsOverview();
			if (response?.success) {
				// setUrl(response?.url ? response?.url : undefined)
				setUrl(response?.url || "");
			} else {
				setError("Oops something went wrong");
				// setUrl(undefined);
				setUrl("");
			}
		} catch (error: any) {
			setError("Oops something went wrong" + error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getReportUrl();
	}, []);

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);
	return (
		<>
			{isLoading && <FallbackLoader />}
			{url ? (
				<section className="dashboardFrame">
					<iframe src={url} width="100%" height="100%" loading="lazy" />
				</section>
			) : null}
		</>
	);
};

export default ReportsSummary;
