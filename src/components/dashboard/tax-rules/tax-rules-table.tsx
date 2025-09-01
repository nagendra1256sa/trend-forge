import { ColumnDef, DataTable } from '@/components/core/data-table';
import FallbackLoader from '@/components/fallback-loader/loader';
import { TaxRuleList } from '@/models/tax-rule-list.model';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { CustomPagination } from "@/components/core/table-pagination";

export interface TaxRuleTableProps {
  rows: TaxRuleList[];
  loading: boolean;
}

const TaxRulesTable = ({ rows, loading }: TaxRuleTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns: ColumnDef<TaxRuleList>[] = [
    {
      name: "Name",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.name || "-"}
        </Typography>
      ),
    },
    {
      name: "Code",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.code ?? "-"}
        </Typography>
      ),
    },
    {
      name: "Created By",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.taxRuleCreatedUserDetails?.displayName ?? "-"}
        </Typography>
      ),
    },
    {
      name: "Created At",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.createdAt ? dayjs(row.createdAt).format('MMM DD, YYYY hh:mm A') : "-"}
        </Typography>
      ),
    },
    {
      name: "Rate",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.taxRates?.[0]?.rate}
        </Typography>
      ),
    },
     {
      name: "MetricType",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.taxRates?.[0]?.metricType === 2 ? "Percentage" :row?.taxRates?.[0]?.metricType === 1 ? "Flat" : ''}
        </Typography>
      ),
    },
    {
      name: "Status",
      width: "auto",
      formatter: (row: TaxRuleList) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.status == null ? "-" : (row.status < 1 ? "InActive" : "Active")}
        </Typography>
      ),
    },
  ];

  if (loading) return <FallbackLoader />;

  return (
    <Box>
      <DataTable columns={columns} rows={paginatedRows} size="small" stickyHeader />

      {rows.length === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            No Tax Rules found
          </Typography>
        </Box>
      )}

      <CustomPagination
        count={rows.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Box>
  );
};

export default TaxRulesTable;
