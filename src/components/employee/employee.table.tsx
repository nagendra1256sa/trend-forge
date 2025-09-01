import { Employee } from '@/models/employee';
import { Box, Tooltip, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react'
import { ColumnDef, DataTable } from '../core/data-table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { CommonAlertDialog } from '../core/common-alert-dialog';
import { useDialog } from '@/hooks/use-dialog';
import { useToInActiveEmployee } from '@/hooks/employee-hooks/use-inactive-employee';
import FallbackLoader from '../fallback-loader/loader';
import { EmployeeFilter } from '@/constants/employee';
import EditDetailsPopUp from './edit-details-pop-up';
import { useEmployeeContext } from '@/contexts/employee-context';

interface ActionMenuProps {
  row: Employee;
  onEdit?: (employee: Employee) => void;
  onUnassign?: (employee: Employee) => void;
  isAssigned?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row, onEdit, onUnassign, isAssigned }) => {
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
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit?.(row);
          }}
        >
          {t("Employee:edit")}
        </MenuItem>
        {isAssigned && (
          <MenuItem
            onClick={() => {
              handleClose();
              onUnassign?.(row);
            }}
          >
            {t("Employee:unassign")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

interface EmployeeTableProps {
  rows: Employee[];
  refetchEmployeesList?: ((limit: number, filters?: EmployeeFilter[]) => Promise<void>) | (() => void);
  displayColumn: string[];
  tableSelection?: boolean;
  rowPerPage?: number;
}

const EmployeeTable = ({ 
  rows, 
  refetchEmployeesList, 
  displayColumn, 
  tableSelection, 
  rowPerPage,
}: EmployeeTableProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { handleClose, handleOpen, open } = useDialog();
  const { handleClose: handleCloseEditDialog, handleOpen: handleOpenEditDialog, open: isEditDialogOpen } = useDialog();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>();
  const { isEmployeeInactive, loading, reFetch } = useToInActiveEmployee(selectedEmployee);
  const [requiredColumns, setRequiredColumns] = useState<ColumnDef<Employee>[]>([]);
  const { assignedEmployee, setAssignedEmployee } = useEmployeeContext();
  const selectedEmployeeId = selectedEmployee?.id;

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    handleOpenEditDialog();
  };

  const handleUnassign = (employee: Employee) => {
    setSelectedEmployee(employee);
    handleOpen();
  };
  const handleCloseUnassign = (isAgree: boolean) => {
    if (isAgree) {
      reFetch();
    }
    handleClose();
  };

  useEffect(() => {
    if (isEmployeeInactive) {
      if (rowPerPage && typeof refetchEmployeesList === 'function' && refetchEmployeesList?.length > 0) {
        // Call with pagination parameters
        (refetchEmployeesList as (limit: number, filters?: EmployeeFilter) => Promise<void>)(rowPerPage);
      } else if (refetchEmployeesList) {
        (refetchEmployeesList as () => void)();
      }
    }
  }, [isEmployeeInactive, rowPerPage]);

  const columns = [
    {
      name: t('Employee:employee_id'),
      width: "auto",
      columnName: "employeeId",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.user_id ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Employee:first_name'),
      width: "auto",
      columnName: "firstName",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.first_name ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Employee:last_name'),
      width: "auto",
      columnName: "lastName",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.last_name ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Employee:role'),
      width: "auto",
      columnName: "role",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.Name}
        </Typography>
      )
    },
    {
      name: t('Employee:email'),
      width: "auto",
      columnName: "email",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.email ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Employee:last_updated_by'),
      width: "auto",
      columnName: "lastUpdatedBy",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.last_updated_by ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Employee:last_updated_at'),
      width: 'auto',
      columnName: "lastUpdatedAt",
      formatter: (row): React.JSX.Element => {
        const date = row?.last_updated_at;
        const formattedTime = date ? dayjs(date).format('h:mm A') : '';

        return (
          <Tooltip title={formattedTime}>
            <Typography sx={{ whiteSpace: 'nowrap' }} variant="inherit">
              {date ? dayjs(date).format('MMM D, YYYY') : '-'}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      name: t('Employee:actions'),
      width: 'auto',
      columnName: "actions",
      formatter: (row): React.JSX.Element => (
        <ActionMenu
          row={row}
          onEdit={handleEdit}
          onUnassign={handleUnassign}
          isAssigned={true}
        />
      ),
    },
    {
      name: t('Employee:actions'),
      width: 'auto',
      columnName: "editActions",
      formatter: (row): React.JSX.Element => (
        <ActionMenu
          row={row}
          onEdit={handleEdit}
          isAssigned={false}
        />
      ),
    }
  ] satisfies ColumnDef<Employee>[];

  useEffect(() => {
    const requiredColumns: ColumnDef<Employee>[] = [];
    for (const name of displayColumn) {
      const column = columns.find((column) => column.columnName === name);
      if (column) {
        requiredColumns.push(column);
      }
    }
    setRequiredColumns(requiredColumns);
  }, [displayColumn, rows]);

  const onSelectOne = (event: React.ChangeEvent, row: Employee) => {
    setAssignedEmployee?.([...assignedEmployee ?? [], row]);
  };

  const onDeselectOne = (event: React.ChangeEvent, row: Employee) => {
    setAssignedEmployee?.(assignedEmployee?.filter((employee) => employee.id !== row.id));
  };

  const onSelectAll = () => {
    setAssignedEmployee?.(rows);
  };

  const onDeselectAll = () => {
    setAssignedEmployee?.([]);
  };

  return (
    <>
      <Box sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
      <DataTable
        columns={requiredColumns}
        rows={rows}
        selectable={tableSelection}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onSelectOne={onSelectOne}
        onDeselectOne={onDeselectOne}
        selected={assignedEmployee ? new Set(assignedEmployee?.map?.((employee) => employee?.id)) : new Set()}
        stickyHeader
        size="small"
        hover
      />
      {rows?.length === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" align="center" variant="body2">
            {t("Employee:no_employees_found")}
          </Typography>
        </Box>
      )}
</Box>
      {open && (
        <CommonAlertDialog
          isOpen={open}
          onClose={handleCloseUnassign}
          title={t("Employee:unassign_title")}
          message={t("Employee:unassign_message")
            .replace("{{first_name}}", selectedEmployee?.first_name ?? "")
            .replace("{{last_name}}", selectedEmployee?.last_name ?? "")}
        />
      )}

      {isEditDialogOpen && selectedEmployeeId !== undefined && (
        <EditDetailsPopUp
          open={isEditDialogOpen}
          close={() => {
  handleCloseEditDialog();
  (refetchEmployeesList as (limit: number, filters?: EmployeeFilter) => Promise<void>)(rowPerPage ?? 0);
}}

          selectedEmployeeId={selectedEmployeeId}
        />
      )}

      {loading && <FallbackLoader />}
    </>
  );
};

export default EmployeeTable;