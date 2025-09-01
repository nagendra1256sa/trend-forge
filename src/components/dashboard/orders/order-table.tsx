import { ColumnDef, DataTable } from "@/components/core/data-table";
import { Check } from "@/models/order.model";
import { Box, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { OrderDetailModal } from "./order-detail";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const columns = [
  {
    name: "Order Id",
    width: "auto",
    className: "",
    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.checkNumber ?? '-'}</Typography>)
  },
  {
    name: 'Date',
    width: 'auto',
    className: '',
    formatter: (row): React.JSX.Element => {
      const date = row?.createdAt;
      const formattedFullDate = date ? dayjs(date).format('h:mm A') : '';

      return (
        <Tooltip title={formattedFullDate}>
          <Typography sx={{ whiteSpace: 'nowrap' }} variant="inherit">
            {date ? dayjs(date).format('MMM D, YYYY') : '-'}
          </Typography>
        </Tooltip>
      );
    },
  },
  {
    name: "Order Type",
    width: "auto",
    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.orderTypeObj?.label ?? '-'}</Typography>)
  },
  {
    name: 'Source',
    width: "auto",
    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.posClient?.title ?? '-'}</Typography>)

  },
  // {
  //   name: "Customer",
  //   width: "auto",
  //   formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.guests && row?.guests?.length ? row?.guests[0]?.displayName : '-'}</Typography>)
  // },
  {
    name: 'Order Status',
    width: "auto",
    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.status}</Typography>)
  },
  //  {
  //   name: 'Payment status',
  //   width: "auto",
  //   formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.checkPayments?.[0]?.paymentStatus ?? "-"}</Typography>)
  // },
  {
    name: "Payment Method",
    width: "auto",
    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.checkPayments &&
      row?.checkPayments?.length &&
      row?.checkPayments[row?.checkPayments?.length - 1]
        .paymentMethod &&
      row?.checkPayments[row?.checkPayments?.length - 1]
        .paymentMethod?.Name
      ? row?.checkPayments[row?.checkPayments?.length - 1]
        ?.paymentMethod?.Name
      : "-"}</Typography>)
  },
  {
    name: 'Order Value',
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        ${row?.orderValue}
      </Typography>
    )
  },
  {
    name: 'Discount',
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        ${row?.discount}
      </Typography>
    )
  },
  {
    name: 'Net Payable',
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        ${row?.total}
      </Typography>
    )
  },

  {
    name: "Assigned Staff",
    width: "auto",
    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.ownerDetails?.displayName ?? "-"}</Typography>)
  },

  // {
  //   name: 'Business Day',
  //   width: "auto",
  //   formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.bussinessDay && timeAgo(row?.bussinessDay)}</Typography>)
  // },

] satisfies ColumnDef<Check>[]



export function OrderTable({ rows }: { rows: Check[] }): React.JSX.Element {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);

  const handleRowClick = (_event: React.MouseEvent, row: Check) => {
    setSelectedRow(Number(row?.id));
    setIsModalOpen(true);
  };
  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        rows={rows}
        onClick={handleRowClick}
        stickyHeader
        size="small"
        hover={true}
      >
      </DataTable>
      {rows?.length === 0 ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
            {t("Order:no_orders_found")}
          </Typography>
        </Box>
      ) : null}

      <OrderDetailModal open={isModalOpen} close={() => setIsModalOpen(false)} id={selectedRow} />

    </React.Fragment>
  )
}
