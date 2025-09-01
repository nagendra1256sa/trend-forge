"use client"
import { ColumnDef, DataTable } from "@/components/core/data-table";
import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton, Menu, Typography, MenuItem } from "@mui/material";
import { MenuItemTableProps } from "@/types/menu";
import { useGetMenuItemById } from "@/hooks/menu-items-hooks/use-get-menu-list";
import MenuDetailModal from "./meni-item-detail";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

const ActionMenu: React.FC<any> = ({ isAssigned }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        ref={anchorRef}
        aria-label="more"
        onClick={handleOpen}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={handleClose}
        open={open}
        slotProps={{ paper: { sx: { width: "200px" } } }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem>{t("Employee:edit")}</MenuItem>
        {isAssigned && <MenuItem>{t("Employee:unassign")}</MenuItem>}
      </Menu>
    </>
  );
};

const columns = [
  {
    name: "Client Id",
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap", textAlign: "left" }} variant="inherit">
        {row?.clientId ?? "-"}
      </Typography>
    ),
  },
  {
    name: "Organization Name",
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "normal", textAlign: "left" }} variant="inherit">
        {row?.organization ?? "-"}
      </Typography>
    ),
  },
  {
    name: "Contact Person",
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        {row?.contactPerson ?? "-"}
      </Typography>
    ),
  },
  {
    name: "Assigned Consultant",
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        {row?.assignedTo ?? "-"}
      </Typography>
    ),
  },
  {
    name: "Status",
    width: "auto",
    formatter: (row): React.JSX.Element => (
      <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
        {row?.status ?? "-"}
      </Typography>
    ),
  },
  {
    name: "Actions",
    width: "auto",
    columnName: "actions",
    formatter: (row): React.JSX.Element => (
      <ActionMenu row={row} isAssigned={!!row?.assignedTo} />
    ),
  },
] satisfies ColumnDef<any>[];

export function MenuItemsListTable({
  rows,
  onUpdateFetchList,
}: MenuItemTableProps): React.JSX.Element {
  const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { menuItem, loading, error, reFetch } = useGetMenuItemById(
    selectedMenuItem ?? 0
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRowClick = (_event: React.MouseEvent) => {
    // setSelectedMenuItem(row?.id);
    // setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(null);
    // onUpdateFetchList()
  };

  const data = [
  {
    "clientId": "TC001",
    "initials": "TS",
    "organization": "Innovatech Dynamics",
    "contactPerson": "Alice Johnson",
    "assignedTo": "Alice Johnson",
    "status": "Active",
    "action": "Deactivate"
  },
  {
    "clientId": "TC002",
    "initials": "TS",
    "organization": "Future Solutions",
    "contactPerson": "Bob Smith",
    "assignedTo": null,
    "status": "Inactive",
    "action": "Deactivate"
  },
  {
    "clientId": "TC003",
    "initials": "TS",
    "organization": "GreenTech Industries",
    "contactPerson": "Cathy Brown",
    "assignedTo": "Cathy Brown",
    "status": "Active",
    "action": "Deactivate"
  },
  {
    "clientId": "TC004",
    "initials": "TS",
    "organization": "NextGen Innovations",
    "contactPerson": "David Lee",
    "assignedTo": null,
    "status": "Inactive",
    "action": "Deactivate"
  },
  {
    "clientId": "TC005",
    "initials": "TS",
    "organization": "Quantum Computing Co.",
    "contactPerson": "Eva Green",
    "assignedTo": null,
    "status": "Active",
    "action": "Deactivate"
  }
]


  return (
    <>
      <Box sx={{ height: "calc(100vh - 400px)", overflow: "auto" }}>
        <DataTable
          columns={columns}
          rows={data}
          hover={true}
          onClick={handleRowClick}
          size="small"
          stickyHeader
        />
      </Box>

      {rows?.length === 0 ? (
        <Box sx={{ p: 3 }}>
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center" }}
            variant="body2"
          >
            {t("menuItem:no_menu_items_found")}
          </Typography>
        </Box>
      ) : null}

      {menuItem && (
        <MenuDetailModal
          openModal={isModalOpen}
          close={handleCloseModal}
          data={menuItem}
          loading={loading}
          onUpdate={reFetch}
          onFetchList={onUpdateFetchList}
        />
      )}
    </>
  );
}
