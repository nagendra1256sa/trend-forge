import ReportsView from '@/components/dashboard/overview/reports-view';
import React from 'react'

const Page = async ({ params }: { params: Promise<{ view: string }> }): Promise<React.JSX.Element> => {
  const { view } = await params;
  return <ReportsView reportType={view} />;
};

export default Page;