'use client'
import TableLayoutView from '@/components/table-layouts/table-layout-view';
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
  const params = useParams();
  const sectionId = params.id as string;

  return <TableLayoutView sectionId={sectionId} />;
}

export default Page
