"use client";

import React, { useState } from "react";
import { GratuityView } from "@/models/gratuity.model";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ColumnDef, DataTable } from "@/components/core/data-table";
import FallbackLoader from "@/components/fallback-loader/loader";
import { CustomPagination } from "@/components/core/table-pagination";
import { useTranslation } from "react-i18next";

export interface GratuityTableProps {
  rows: GratuityView[] | [];
  loading: boolean;
}

const GratuityTable = ({ rows, loading }: GratuityTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { t } = useTranslation();
  const paginatedRows = rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event?.target?.value, 10));
    setPage(0);
  };

  const columns: ColumnDef<GratuityView>[] = [
    {
      name: "Name",
      width: "auto",
      formatter: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.name || "-"}
        </Typography>
      ),
    },
    {
      name: "Code",
      width: "auto",
      formatter: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.code ?? "-"}
        </Typography>
      ),
    },
    {
      name: "Rate",
      width: "auto",
      formatter: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.rate ?? "-"}
        </Typography>
      ),
    },
    {
      name: "MetricType",
      width: "auto",
      formatter: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.metricType ?? "-"}
        </Typography>
      ),
    },
    {
      name: "Status",
      width: "auto",
      formatter: (row) => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.status === null ? "-" : row.status >= 1 ? "Active" : "InActive"}
        </Typography>
      ),
    },
  ];

  if (loading) return <FallbackLoader />;

  return (
    <Box>
      <DataTable columns={columns} rows={paginatedRows} size="small" stickyHeader />

      {rows?.length === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            {t("Gratuity:no_gratuity_found")}
          </Typography>
        </Box>
      )}

      <CustomPagination
        count={rows?.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Box>
  );
};

export default GratuityTable;
