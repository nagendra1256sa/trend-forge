'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton
} from '@mui/material';
import {
  ArrowLeft,
  CheckCircle,
  Lock,
  PushPin,
  X,
  User,
  Pencil,
  Star
} from '@phosphor-icons/react';
import { useGetLayouts } from '@/hooks/table-layouts-hooks/use-get-sections';
import { useGetTablesDetails } from '@/hooks/table-layouts-hooks/use-get-table';
import { SectionLayout, TableDetails } from '@/models/table-layout';
import FallbackLoader from '../fallback-loader/loader';
import { useRouter } from "next/navigation";
import { useRedirection } from '@/hooks/table-layouts-hooks/use-redirecation';
import { useTranslation } from 'react-i18next';
import { useHeaderTitle } from '@/hooks/header-title';

interface ConfirmDialogState {
  open: boolean;
  tableId: number | null;
  tableName: string;
}

interface TableLayoutViewProps {
  sectionId?: string;
}

const TableLayoutView: React.FC<TableLayoutViewProps> = ({ sectionId }): React.JSX.Element => {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<SectionLayout | null>(null);
  // const [showSections, setShowSections] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    tableId: null,
    tableName: ''
  });
  const { layoutSections = [] } = useGetLayouts();
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeaderTitle();
  const { tables, loading: tableDetailsLoading, refetch, setTables } = useGetTablesDetails();
  useRedirection()
  // Handle section selection logic
  useEffect(() => {
    setHeaderTitle(t('TableLayouts:table_layouts'));
    if (layoutSections?.length === 0) {
      // setShowSections(true);
      setCurrentSection(null);
      setTables([]);
      return;
    }

    if (sectionId) {
      const section = layoutSections.find(
        (section: SectionLayout) => section.id === Number(sectionId)
      );
      if (section) {
        setCurrentSection(section);
        refetch(section.id);
        // setShowSections(false);
      } else {
        // setShowSections(false);
      }
    } else if (layoutSections?.length === 1) {
      // If only one section, auto-select it
      // setShowSections(false);
      refetch(layoutSections[0]?.id);
      setCurrentSection(layoutSections[0]);
    } else {
      // Multiple sections, show selection view
      // setShowSections(true);
    }
  }, [layoutSections, refetch, sectionId, setTables]);

  // // Handle add section errors
  // useEffect(() => {
  //   if (addNewSectionError) {
  //     const error = addNewSectionError;
  //     switch (error) {
  //       case "error_table_layout_already_exist_for_bc": {
  //         toast.error('Table layout already exist for business center!');
  //         return;
  //       }
  //       case "error_table_already_exist_with_same_name": {
  //         toast.error('Table name already exist!');
  //         return;
  //       }
  //       default: {
  //         toast.error('Oops something went wrong!');
  //       }
  //     }
  //   }
  // }, [addNewSectionError]);

  // useEffect(() => {
  //   if (newSection) {
  //     setAddSectionDialog(false);
  //     toast.success('New section added successfully');
  //     getLayouts();
  //   }
  // }, [newSection, getLayouts]);

  // const openAddSectionDialog = (): void => {
  //   setAddSectionDialog(true);
  // };

  // const handleCancelAddSection = (): void => {
  //   setAddSectionDialog(false);
  // };

  // const handleAddSection = (value: any) => {
  //   const payLoad = NewSectionBinder.bind(value);
  //   try {
  //     addNewSectionRefetch(payLoad);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleSectionSelect = (section: SectionLayout): void => {
  //   setCurrentSection(section);
  //   setShowSections(false);
  //   refetch(section?.id);
  //   router.push(`/table-layouts/${section?.id}`);
  // };

  const handleBackToSections = (): void => {
    // setShowSections(true);
    setCurrentSection(null);
    setTables([]);
    router.push('/table-layouts');
  };

  const handleEditTable = (): void => {
    if (currentSection?.id) {
      router.push(`/table-layouts/edit-table/${currentSection.id}`);
    }
  };

  const handleConfirmSelection = (): void => {
    if (confirmDialog.tableId) {
      //   selectTableAPI(confirmDialog.tableId);
    }
    setConfirmDialog({ open: false, tableId: null, tableName: '' });
  };

  const handleCancelSelection = (): void => {
    setConfirmDialog({ open: false, tableId: null, tableName: '' });
  };

  const getTableStyle = (table: TableDetails): React.CSSProperties => ({
    position: 'absolute',
    left: `${Number(table?.x) + 10}px`,
    top: `${Number(table?.y) + 10}px`,
    width: '70px',
    height: '70px',
    borderRadius: !table?.shape || table.shape === 'round'
      ? '50%'
      : table.shape === 'square'
        ? '8px'
        : '8px',
    border: `2px solid ${table.status === 1 ? '#46D44C' : table.status === 3 ? '#bdbdbd' : '#f44336'}`,
    backgroundColor: table.status === 1 ? '#e8f5e8' : table.status === 3 ? '#efefef' : '#efefef',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: table.status === 1 ? 'pointer' : 'not-allowed',
    fontSize: '12px',
    fontWeight: 'bold',
    color: `${table?.status === 1 ? '#46D44C' : table?.status === 3 ? '#9e9e9e' : '#f44336'}`,
    transition: 'all 0.2s ease',
    transform: table.shape === 'rectangle' ? 'scaleX(1.5)' : 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  });

  const getStatusIcon = (status: number): React.ReactNode => {
    const iconProps = { size: 16, style: { verticalAlign: "bottom" } };

    switch (status) {
      case 1: {
        return <User {...iconProps} color="#46D44C" />;
      }
      case 3: {
        return <Lock {...iconProps} color="#9e9e9e" />;
      }
      case 4: {
        return <PushPin {...iconProps} color="#DD8782" />;
      }
      default: {
        return <X {...iconProps} color="#f44336" />;
      }
    }
  };

  const StatusIndicator: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <Typography
      variant='body2'
      sx={{
        position: 'relative',
        pl: 2,
        '&::before': {
          content: '""',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        },
      }}
    >
      {label}
    </Typography>
  );


  return (
    <><Box sx={{ bgcolor: '#f5f5f5', p: 3, }}>
      {tableDetailsLoading && <FallbackLoader />}

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {layoutSections?.length > 1 && (
              <Button
                variant="outlined"
                size='small'
                startIcon={<ArrowLeft />}
                onClick={handleBackToSections}
                sx={{ mr: 4 }}
              >
                Back
              </Button>
            )}
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
              {currentSection?.name && ` ${currentSection?.name} -`}Table(s)
            </Typography>
          </Box>
          {/* <Button
          variant="outlined"
          onClick={handleEditTable}
          sx={{ mr: 2 }}
          startIcon={<Pencil />}
        >

        </Button> */}
          <IconButton
            onClick={handleEditTable}
            sx={{
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                color: 'primary.dark'
              }
            }}
          >
            <Pencil />
          </IconButton>
        </Box>
      </Box>

      {/* Tables Display */}
      <Card sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {currentSection?.name && `Floor Plan - ${currentSection?.name || '-'}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <StatusIndicator color="#46D44C" label="Available" />
            <StatusIndicator color="#bdbdbd" label="Occupied" />
            <StatusIndicator color="#DD8782" label="Inactive" />
          </Box>
        </CardContent>

        {tableDetailsLoading ? (
          <FallbackLoader />
        ) : (
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              m: 1,
              bgcolor: '#fafafa',
              border: '2px dashed #ddd',
              borderRadius: 1,
              overflow: 'auto',
              minHeight: 400,
            }}
          >
            {tables?.map(table => (
              <Box
                key={table?.id}
                sx={getTableStyle(table)}
              >
                <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, textTransform: "capitalize" }}>
                  {table?.name || '-'}
                </Typography>

                <Stack direction="row" alignItems={'center'} sx={{ gap: "2px" }}>
                  <span>{getStatusIcon(table?.status ?? 0)}</span>
                  <Typography variant="body2">
                    {table?.seats || 0}
                  </Typography>
                </Stack>
                {table?.isVipTable && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#ff4d4f',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Star />
                  </Box>
                )}
              </Box>
            ))}

            {tables?.length === 0 && !tableDetailsLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                  🪑
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No tables found in this section
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Card>


      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog?.open}
        onClose={handleCancelSelection}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Table Selection
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to select table <strong>{confirmDialog.tableName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will mark the table as occupied and trigger the reservation process.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSelection} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSelection}
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
          >
            Select Table
          </Button>
        </DialogActions>
      </Dialog>
    </Box></>

  );
};

export default TableLayoutView;