"use client";
import { ColumnDef, DataTable } from "@/components/core/data-table";
import React from "react";
import { Box, Typography } from "@mui/material";
import { OrderType } from "@/models/order-type.model";
import type { OrderTypeTableProps } from "@/types/order-type";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const columns = [
   {
      name: "Order Type",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.label ?? '-'}</Typography>),
   },
   {
      name: "Available Channel",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.availableChannels?.[0]?.title ?? '-'}</Typography>),
   },
   {
      name: "Status",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.availableChannels?.[0]?.status ?? '-'}</Typography>),
   },
   // {
   //    name: "Preparation Time",
   //    width: "auto",
   //    formatter: (row): React.JSX.Element => {
   //       if(!row?.avgOrderTime) return <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">-</Typography>;
   //       const durationObj = dayjs.duration(row?.avgOrderTime, 'seconds');
   //       const formatted = `${durationObj.hours()}h ${durationObj.minutes()}m`;
   //       return (
   //          <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
   //             {formatted}
   //          </Typography>
   //       );
   //    }
   // },

   // {
   //    name: "Minimum Order Amount",
   //    width: "auto",
   //    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">${row?.minOrderAmount ?? '-'}</Typography>),
   // },
   // {
   //    name: "Created By",
   //    width: "auto",
   //    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.creatorName ?? '-'}</Typography>),
   // },
   {
      name: "Last Updated On",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.updatedAt ? dayjs(row?.updatedAt).format('MMM D, YYYY') : '-'}</Typography>),
   },
   //  {
   //    name: "Applicable Hours",
   //     width: "auto",
   //    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.hoursAvailable   ?? '-'}</Typography>),
   // },
   //   {
   //       name: "External Id",
   //       width: "250px",
   //       formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.cloverId ?? '-'}</Typography>),
   //    },

] satisfies ColumnDef<OrderType>[]

export function OrderTypeTable({ rows }: OrderTypeTableProps): React.JSX.Element {
   const { t } = useTranslation();
   return (
      <React.Fragment>
         <DataTable
            columns={columns}
            rows={rows}
            size="small"
         >
         </DataTable>
         {rows?.length === 0 ? (
            <Box sx={{ p: 3 }}>
               <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                  {t("OrderType:no_order_types_found")}
               </Typography>
            </Box>
         ) : null}
      </React.Fragment>
   )
}