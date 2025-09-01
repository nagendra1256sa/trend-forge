"use client"
import { ColumnDef, DataTable } from "@/components/core/data-table";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { MenuItem } from "@/models/menu-item.model";
import { MenuItemTableProps } from "@/types/menu";
import { useGetMenuItemById } from "@/hooks/menu-items-hooks/use-get-menu-list";
import MenuDetailModal from "./meni-item-detail";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import dayjs from "dayjs";

const columns = [
   {
      name: "SKU",
      width: "auto",
      className: "",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap", textAlign: 'left' }} variant="inherit">{row?.sku ?? '-'}</Typography>),
   },
   {
      name: "Menu Item Name",
      width: "auto",

      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "wrap", textAlign: 'left' }} variant="inherit">{row?.label ?? '-'}</Typography>),
   },
   // {
   //    name: "Display Name",
   //    width: "auto",
   //    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "wrap" }} variant="inherit">{row?.displayName ? row?.displayName : row?.label}</Typography>),
   // },
   {
      name: "Category",
      width: "auto",
      formatter: (row): React.JSX.Element => (
         <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
            {row?.primaryCategory ? String(row.primaryCategory) : '-'}
         </Typography>
      ),
   },
   {
      name: "Sub Category",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.secondaryCategory ? String(row.secondaryCategory) : "-"}</Typography>),
   },
  //  {
  //     name: "Base Price",
  //     width: "auto",
  //     formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{`$${row?.basePrice ?? '-'}`}</Typography>),
  //  },
   {
      name: "Selling Price",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{`$${row?.sellingPrice ?? '-'}`}</Typography>),
   },
   // {
   //    name: "Preparation Time",
   //    width: "auto",
   //    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap", textAlign: "center" }} variant="inherit">{row?.cookingTime ?? '-'}</Typography>),
   // },
   {
      name: "Available",
      width: "auto",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap", textAlign: "center" }} variant="inherit">{row?.status === 1 ? 'Yes' : 'No'}</Typography>),
   },
   //  {
   //    name: "Updated By",
   //    width: "auto",
   //    align: "center",
   //    formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.updatedBy ?? '-'}</Typography>),
   // },
    {
      name: "Last Updated On",
      width: "auto",
      className: "",
       align: "center",
      formatter: (row): React.JSX.Element => (<Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">{row?.updatedAt ? dayjs(row?.updatedAt).format('MMM D, YYYY')  : "-"}</Typography>),
   },
] satisfies ColumnDef<MenuItem>[]

export function MenuItemsListTable({ rows,onUpdateFetchList }: MenuItemTableProps): React.JSX.Element {
   const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const { menuItem, loading, error,reFetch } = useGetMenuItemById(selectedMenuItem ?? 0);
   
   const { t } = useTranslation();
   useEffect(() => {
      if (error) {
         toast.error(error);
      }
   }, [error])
   const handleRowClick = (_event: React.MouseEvent, row: MenuItem) => {
      setSelectedMenuItem(row?.id);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedMenuItem(null);
      // onUpdateFetchList()

   };
   return (
      <>
         <Box sx={{ height: "calc(100vh - 300px)", overflow: "auto" }}>
            <DataTable
               columns={columns}
               rows={rows}
               hover={true}
               onClick={handleRowClick}
               size="small"
               stickyHeader
            />
         </Box>
         {rows?.length === 0 ? (
            <Box sx={{ p: 3 }}>
               <Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
                  {t("menuItem:no_menu_items_found")}
               </Typography>
            </Box>
         ) : null}
         {menuItem && (
            <MenuDetailModal openModal={isModalOpen} close={handleCloseModal} data={menuItem} loading={loading} onUpdate={reFetch} onFetchList={onUpdateFetchList} />
         )}
      </>
   )
}