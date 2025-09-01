import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import React, { useRef, useState } from 'react'
import { ColumnDef, DataTable } from '../core/data-table';
import { useTranslation } from 'react-i18next';
import { Reason } from '@/models/reasons';
import ReasonsDetails from './reasons.details';
import { useDialog } from '@/hooks/use-dialog';
import { ReasonTypeManager } from './reason-type-manager';


interface ActionMenuProps {
  row: Reason;
  onEdit?: (reason: Reason) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ row, onEdit }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleOpen = (event: React.MouseEvent) => {
  event.stopPropagation();
  setOpen(true);
};
  const handleClose = (event: React.MouseEvent) => {
  event.stopPropagation();
  setOpen(false);
};

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
          onClick={(e) => {
            handleClose(e);
            onEdit?.(row);
          }}
        >
          {t("Employee:edit")}
        </MenuItem>
      </Menu>
    </>
  );
};

interface ReasonTableProps {
  rows: Reason[];
  reFetchList: (isRefetch?: boolean) => void;
}


const ReasonTable = ({ 
  rows,
  reFetchList 
}: ReasonTableProps): React.JSX.Element => {
  const [reasonId, setReasonId] = useState<number>(0);
  const { t } = useTranslation();
  const [editReasonId, setEditReasonId] = useState<number | null>(null);
  const {open,handleOpen,handleClose} = useDialog();
 

  const columns = [
    {
      name: t('Reasons:Refund_Type'),
      width: "auto",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.ReasonTypeObj?.Type ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Reasons:Reason'),
      width: "auto",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.Reason ?? '-'}
        </Typography>
      )
    },
    {
      name: t('Reasons:Description'),
      width: "auto",
      formatter: (row): React.JSX.Element => (
        <Typography sx={{ whiteSpace: "nowrap" }} variant="inherit">
          {row?.Description || '-'}
        </Typography>
      )
    },
    {
      name: t('Employee:actions'),
      width: 'auto',
      formatter: (row): React.JSX.Element => (
        <ActionMenu
          row={row}
          onEdit={handleEdit}
        />
      ),
    },
  ] satisfies ColumnDef<Reason>[];


     const handleEdit = (reason: Reason) => {
      setEditReasonId(reason.ID);
      handleOpen();
  };

  const handleClosePopup = (isRefetch?: boolean) => {
    handleClose();
    reFetchList(isRefetch);
  }

  const handleRowClick = (event: React.MouseEvent, row: Reason): void => {
    setReasonId(row?.ID);
  }

  return (
    
   <>
    <Box sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
      <DataTable
        columns={columns}
        onClick={handleRowClick}
        rows={rows}
        stickyHeader
        size="small"
        hover
      />
    </Box>

      {rows?.length === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" align="center" variant="body2">
            {t("Reasons:No_Reasons")}
          </Typography>
        </Box>
      )}

      {
        open && (
          <ReasonTypeManager
            pageType="edit"
            open={open}
            close={(isRefetch)=>{
              handleClosePopup(isRefetch);
            }}
            reasonId={editReasonId}
          />
        )
      }

      {
        reasonId > 0 && <ReasonsDetails open={!!reasonId} close={() => setReasonId(0)} id={reasonId}/>
      }
            

   </>
  );
};

export default ReasonTable;