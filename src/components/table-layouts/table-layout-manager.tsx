'use client';

import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper,
    Chip,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Stack
} from '@mui/material';

import {
    FloppyDisk,
    Trash,
    Info,
    PlusCircle,
    User,
    PushPin,
    X,
    Lock,
    Star,
    Circle, Square, Rectangle,
    CaretLeft
} from '@phosphor-icons/react';
import { useGetTablesDetails } from '@/hooks/table-layouts-hooks/use-get-table';
import { SectionLayout, TableDetails } from '@/models/table-layout';
import TableEditForm, { TableData } from './table-edit-form';
import { useGetLayouts } from '@/hooks/table-layouts-hooks/use-get-sections';
import { UpdateTablePayLoad } from '@/models/table-layout.model';
import { useUpdateTableById } from '@/hooks/table-layouts-hooks/use-update-table';
import { toast } from 'sonner';
import { useCreateTables } from '@/hooks/table-layouts-hooks/use-post-layout';
import { NewSectionBinder, TableBinder } from '@/constants/table-layouts';
import FallbackLoader from '../fallback-loader/loader';
import { redirect } from 'next/navigation';
import { useAddNewSection } from '@/hooks/table-layouts-hooks/use-add-new-section';
import { useDeleteTableById } from '@/hooks/table-layouts-hooks/use-delete-table';
import { useRouter } from 'next/navigation';
import { useBusinessCenter } from '@/contexts/businesscenter-context';
import { AddSectionDialog } from './add-new-sections';
import { useRedirection } from '@/hooks/table-layouts-hooks/use-redirecation';




//

interface TableShape {
    id: 'round' | 'square' | 'rectangle';
    name: string;
    icon: ReactNode;
}

interface DragOffset {
    x: number;
    y: number;
}

interface AdjustedPoints {
    x: number | null;
    y: number | null;
}


interface ManageTableDetailsProps {
    layoutId: number
}
const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);

const navigaToTablesListById = (id: number): void => {
    redirect(`/table-layouts/edit-table/${id}`);
};

const ManageTableDetails: React.FC<ManageTableDetailsProps> = ({ layoutId }: ManageTableDetailsProps) => {
    const [existingTables, setExistingTables] = useState<TableDetails[]>([]);
    const [newTables, setNewTables] = useState<TableDetails[]>([]);
    const [selectedTable, setSelectedTable] = useState<TableDetails | null>(null);
    const [currentSection, setCurrentSection] = useState<number>(0);
    const [nextTableId, setNextTableId] = useState<number>(1);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggedShape, setDraggedShape] = useState<string | null>(null);
    const [draggingTable, setDraggingTable] = useState<TableDetails | null>(null);
    const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
    const [addSectionDialog, setAddSectionDialog] = useState<boolean>(false);
    // const [newSectionName, setNewSectionName] = useState<string>('');
    const [adjustedPoints, setAdjustedPoints] = useState<AdjustedPoints>({ x: null, y: null });
    const floorPlanRef = useRef<HTMLDivElement>(null);
    const [openInstructionsDialog, setOpenInstructionsDialog] = useState<boolean>(false);
    const [clearConfirmDialog, setClearConfirmDialog] = useState<boolean>(false);
    const [allTable, setTotalTable] = useState<TableDetails[]>([]);

    const { layoutSections, refetch: refetchLayouts } = useGetLayouts();

    const { refetch, tables, error: fetchTablesError, loading: fetchTablesLoading } = useGetTablesDetails();
    const { contextLoading } = useBusinessCenter();

    const { createTables, loading: createTablesLoading, error: createTablesError, message: createTablesMessage } = useCreateTables();

    const { isTableUpdate, error: updateError, loading: updateLoading, reFetch: updateTableById } = useUpdateTableById();

    const { newSection, error: addNewSectionError, loading: addNewSectionLoading, reFetch: addNewSectionRefetch } = useAddNewSection();
    const { message, deleteTableLayout, error: updateDeleteError, loading: deleteLoading, tableDeleted } = useDeleteTableById();
    const router = useRouter();
    useRedirection();

    React.useEffect(() => {
        if (fetchTablesError || createTablesError || updateDeleteError || updateError || addNewSectionError) {
            const error = fetchTablesError || createTablesError || updateDeleteError || updateError || addNewSectionError;
            switch (error) {
                case "error_table_layout_already_exist_for_bc": {
                    toast.error('Table layout already exist for business center!');
                    return;
                }
                case "error_table_already_exist_with_same_name": {
                    toast.error('Table name already exist!');
                    return;
                }
                default: {
                    toast.error('Oops something went wrong!');
                }
            }
        }
    }, [fetchTablesError, createTablesError, updateDeleteError, updateError, addNewSectionError]);


    useEffect(() => {
        refetch(layoutId);
        if (createTablesMessage || tableDeleted) {
            setSelectedTable(null);
        }
    }, [layoutId, createTablesMessage, message, contextLoading, tableDeleted, refetch]);

    useEffect(() => {
        if (newSection) {
            setAddSectionDialog(false);
            refetchLayouts();
        }

        if (createTablesMessage) {
            refetch(layoutId);
        }

    }, [newSection, createTablesMessage, refetchLayouts, refetch, layoutId]);


    useEffect(() => {
        setTotalTable([...newTables, ...existingTables]);
    }, [newTables, existingTables]);


    useEffect(() => {
        setTotalTable([...existingTables]);
        setNewTables([])
    }, [createTablesMessage]);


    useEffect(() => {
        setExistingTables(
            (tables || []).map(table => ({
                ...table
            }))
        );
    }, [tables, tables?.length]);


    const tableShapes: TableShape[] = [
        { id: 'round', name: 'Round', icon: <Circle /> },
        { id: 'square', name: 'Square', icon: <Square /> },
        { id: 'rectangle', name: 'Rectangle', icon: <Rectangle /> }
    ];


    const handleOpenInstructions = (): void => {
        setOpenInstructionsDialog(true);
    };

    const handleCloseInstructions = (): void => {
        setOpenInstructionsDialog(false);
    };

    const handleUpdateSuccess = async (tableId: number | string, tableData: TableData): Promise<void> => {

        try {
            const isNewTable = newTables.some(t => t.id === tableId);

            if (isNewTable) {
                const bindedData = UpdateTablePayLoad.BindForm(tableData, true);
                // Check if table name already exists (excluding the current table)
                const isDuplicateName = allTable.some(table =>
                    table.name === bindedData.name && table.id !== tableId
                );

                if (isDuplicateName) {
                    toast.error("Table name already exists.");
                    return;
                }

                setNewTables(prev =>
                    prev.map(table =>
                        table.id === tableId ? {
                            ...table,
                            ...bindedData,
                            x: adjustedPoints?.x || table.x,
                            y: adjustedPoints?.y || table.y
                        } : table
                    )
                );
                toast.success("Table updated");
            }
            else {
                if (selectedTable?.status === 3) {
                    toast.error('Occupied table(s) can not be updated.');
                    return;
                }
                const payload = UpdateTablePayLoad.BindForm(tableData, false, adjustedPoints);
                if (payload && selectedTable?.id) {
                    await updateTableById(layoutId, payload, selectedTable.id);

                }
            }
        } catch (error) {
            console.error("Failed to update table:", error);
        }
    };


    useEffect(() => {
        if (isTableUpdate) {
            toast.success('Table updated successfully');
            refetch(layoutId);
            setSelectedTable(null);
        }
    }, [isTableUpdate]);

    const saveLayout = useCallback(async (): Promise<void> => {

        if (newTables?.length === 0) {
            return;
        };
        const getRequestBody = newTables?.length ? newTables?.map(table => TableBinder.bind(table)) : [];
        await createTables(layoutId, getRequestBody);
        // await refetch(layoutId);
    }, [newTables, layoutId, createTables, refetch]);

    const clearLayout = useCallback(async (): Promise<void> => {
        setClearConfirmDialog(false);
        handleDeleteSuccess();

    }, []);

    const handleClearConfirm = (): void => {
        setClearConfirmDialog(true);
    };

    const handleClearCancel = (): void => {
        setClearConfirmDialog(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, shape: string): void => {
        setDraggedShape(shape);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'copy';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };
    // const generateNumericId = () => Date.now() + Math.floor(Math.random() * 1000);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        if (!draggedShape || !floorPlanRef?.current) return;

        const newTable = {
            id: generateNumericId(),
            name: `T${nextTableId}`,
            shape: draggedShape,
            x: 90,
            y: 90,
            seats: 4,
            section: currentSection,
            isVipTable: false,
            status: 1,
            isNew: true
        };
        setNewTables(prev => {
            const updatedTables = [...prev, newTable];
            console.log("Tables count after add:", updatedTables.length);
            return updatedTables;
        });
        console.log(newTables?.length);
        setNextTableId(prev => prev + 1);
        setDraggedShape(null);
        setIsDragging(false);
    };


    const handleTableClick = (table: TableDetails): void => {
        setAdjustedPoints({
            x: table?.x,
            y: table?.y
        });
        setSelectedTable(table);
    };

    const openAddSectionDialog = (): void => {
        // setNewSectionName('');
        setAddSectionDialog(true);
    };

    const handleAddSection = (value: any) => {
        const payLoad = NewSectionBinder.bind(value);
        try {
            addNewSectionRefetch(payLoad);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelAddSection = (): void => {
        setAddSectionDialog(false);
    };

    // const navigaToTablesListById = (id: number): void => {
    //     redirect(`/table-layouts/edit-table/${id}`);
    // };

    const getTableStyle = (table: TableDetails) => ({
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
        // border: `2px solid ${table.status === 1 ? '#46D44C' : table.status === 3 ? '#bdbdbd' : '#f44336'}`,
        border: `3px solid ${selectedTable?.id === table.id ? '#1976d2' : table.status === 1 ? '#46D44C' : table.status === 3 ? '#bdbdbd' : table.status === 2 ? '#f44336' : table.isNew ? '#4caf50' : '#ddd'}`,
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
        zIndex: draggingTable?.id === table.id ? 20 : selectedTable?.id === table.id ? 10 : 1,
        boxShadow: selectedTable?.id === table.id ? '0 4px 12px rgba(25,118,210,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }
    });

    const handleTableMouseDown = (e: React.MouseEvent<HTMLDivElement>, table: TableDetails): void => {
        e.stopPropagation();
        setDraggingTable(table);
        setSelectedTable(table);
        const rect = floorPlanRef.current?.getBoundingClientRect();
        if (rect && table?.x && table?.y) {
            setDragOffset({
                x: e.clientX - rect.left - table?.x,
                y: e.clientY - rect.top - table?.y
            });
        }
        setIsDragging(true);
    };

    // const handleMouseMove = useCallback((e: MouseEvent): void => {
    //     if (!draggingTable || !floorPlanRef.current) return;

    //     const rect = floorPlanRef.current.getBoundingClientRect();
    //     const X = e.clientX - rect.left - dragOffset.x;
    //     const Y = e.clientY - rect.top - dragOffset.y;

    //     setAdjustedPoints({ x: X, y: Y });

    //     if (draggingTable.isNew) {
    //         setNewTables(prev =>
    //             prev.map((t: TableDetails) =>
    //                 t.id === draggingTable.id ? { ...t, x: X, y: Y } : t
    //             )
    //         );
    //     } else {
    //         setExistingTables(prev =>
    //             prev.map((t: TableDetails) =>
    //                 t.id === draggingTable.id ? { ...t, x: X, y: Y } : t
    //             )
    //         );
    //     };
    //     console.log(newTables);
    // }, [draggingTable, dragOffset]);

    // const BackToTableView = (): void => {
    //     router.push(`/table-layouts/?tableLayoutId=${layoutId}`);
    // }


    const handleMouseMove = useCallback((e: MouseEvent): void => {
        if (!draggingTable || !floorPlanRef.current) return;

        const rect = floorPlanRef.current.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        const tableWidth = 70;
        const tableHeight = 70;

        // Raw position calculation
        let X = e.clientX - rect.left - dragOffset.x;
        let Y = e.clientY - rect.top - dragOffset.y;

        // Clamp X and Y so table doesn't overflow outside
        X = Math.max(0, Math.min(X, containerWidth - tableWidth));
        Y = Math.max(0, Math.min(Y, containerHeight - tableHeight));

        setAdjustedPoints({ x: X, y: Y });

        if (draggingTable.isNew) {
            setNewTables(prev =>
                prev.map((t: TableDetails) =>
                    t.id === draggingTable.id ? { ...t, x: X, y: Y } : t
                )
            );
        } else {
            setExistingTables(prev =>
                prev.map((t: TableDetails) =>
                    t.id === draggingTable.id ? { ...t, x: X, y: Y } : t
                )
            );
        }
    }, [draggingTable, dragOffset]);


    const handleMouseUp = useCallback((): void => {
        if (draggingTable) {
            setDraggingTable(null);
            setIsDragging(false);
        }
    }, [draggingTable]);


    useEffect(() => {
        if (isDragging && draggingTable) {
            globalThis.addEventListener('mousemove', handleMouseMove);
            globalThis.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            globalThis.removeEventListener('mousemove', handleMouseMove);
            globalThis.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, draggingTable, handleMouseMove, handleMouseUp]);

    const getLayoutName = useCallback((id: number): string => {
        const section = layoutSections.find(section => section?.id === id);
        return section?.name ?? '';
    }, [layoutSections, currentSection]);

    const handleBack = () => {
        router.push(`/table-layouts/${layoutId}`)
    }
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

    const stateRef = useRef({ newTables, existingTables });
    useEffect(() => {
        stateRef.current = { newTables, existingTables };
    }, [newTables, existingTables]);

    const handleDeleteSuccess = useCallback(async (tableId?: number | string): Promise<void> => {
        try {
            const { newTables: currentNewTables, existingTables: currentExistingTables } = stateRef.current;

            if (tableId) {
                const isNewTable = currentNewTables.some(t => t.id === tableId);

                if (isNewTable) {
                    setNewTables(prev => prev.filter(table => table.id !== tableId));
                    toast.success('Table deleted successfully');
                    setSelectedTable(null);
                } else if (typeof tableId === 'number') {
                    const isOccupiedTable = [...currentNewTables, ...currentExistingTables].some(t => t.id === tableId && t.status === 3);
                    if (isOccupiedTable) {
                        toast.error('Occupied table(s) can not be deleted.');
                        return;
                    }
                    await deleteTableLayout(layoutId, [tableId]);
                }
            } else if ([...currentNewTables, ...currentExistingTables].length > 0) {
                const isOccupied = [...currentNewTables, ...currentExistingTables].some(t => t.status === 3);
                if (isOccupied) {
                    toast.error('In table layout have occupied table(s), you can not delete it.');
                    return;
                }
                const allTableIds = [...currentNewTables, ...currentExistingTables].map(table => table.id);
                await deleteTableLayout(layoutId, allTableIds);
                setNewTables([]);
            }
        } catch (error) {
            console.error("Failed to delete table:", error);
            toast.error('Failed to delete table');
        }
    }, [layoutId, deleteTableLayout]);


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
        <>
            {
                (fetchTablesLoading || createTablesLoading || updateLoading || addNewSectionLoading || deleteLoading) && <FallbackLoader />
            }
            <Box sx={{ p: 3, }}>

                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, }}>
                            <Button onClick={handleBack}>
                                <CaretLeft size={24} />
                            </Button>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center' }}>
                                Table Configuration
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" startIcon={<FloppyDisk />} onClick={saveLayout} sx={{ bgcolor: '#1976d2' }} disabled={newTables.length === 0}>
                                Save Layout
                            </Button>
                            <Button variant="outlined" startIcon={<Trash />} onClick={handleClearConfirm} color="error" disabled={existingTables?.length === 0 && newTables?.length === 0}>
                                Clear
                            </Button>
                        </Box>
                    </Box>

                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 'calc(100vh - 150px)',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={{ width: '32%' }}>
                        <Card sx={{ height: 'fit-content', maxHeight: '100%', overflow: 'auto' }}>
                            <CardContent>
                                {/* Table Shapes */}
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Table Shapes
                                    </Typography>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        size="small"
                                        onClick={handleOpenInstructions}
                                    >
                                        <Info />
                                    </Button>
                                </Box>
                                <Grid container spacing={1} sx={{ mb: 3 }}>
                                    {tableShapes?.map((shape: TableShape) => (
                                        <Grid item xs={4} key={shape.id}>
                                            <Paper
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, shape.id)}
                                                sx={{
                                                    p: 2,
                                                    textAlign: 'center',
                                                    cursor: 'grab',
                                                    '&:hover': { bgcolor: 'grey.100' },
                                                    '&:active': { cursor: 'grabbing' }
                                                }}
                                            >
                                                <Typography variant="h4">
                                                    {shape?.icon}
                                                </Typography>
                                                <Typography variant="caption">
                                                    {shape?.name}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Divider sx={{ mb: 3 }} />

                                {/* Instructions Dialog */}
                                <Dialog
                                    open={openInstructionsDialog}
                                    onClose={handleCloseInstructions}
                                    aria-labelledby="instructions-dialog-title"
                                >
                                    <DialogTitle id="instructions-dialog-title">
                                        💡How to Use Table Configuration
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText sx={{ mb: 1 }}>
                                            Follow these steps to manage your floor plan:
                                        </DialogContentText>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {' • Drag shapes from the "Table Shapes" section to create new tables on the floor plan.'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Click and drag existing tables to reposition them as needed.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {'• Click a table to select it and edit its properties in the "Table Properties" section.'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: '#4caf50', fontWeight: 'bold' }}>
                                            • Green borders indicate new tables that haven&apos;t been saved yet.
                                        </Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseInstructions} color="primary" variant="contained">
                                            Got It
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                {/* Sections */}
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Sections
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: "flex-end", mb: 3 }}>
                                    <FormControl size="small" sx={{ flexGrow: 1 }}>
                                        <InputLabel>Choose Section</InputLabel>
                                        <Select
                                            value={layoutId}
                                            label="Choose Section"
                                            onChange={(e) => {
                                                setCurrentSection(Number(e.target.value));
                                                navigaToTablesListById(Number(e.target.value));
                                            }}
                                        >
                                            {layoutSections.map((section: SectionLayout) => (
                                                <MenuItem key={section?.id} value={section?.id}>
                                                    {section?.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton
                                        onClick={openAddSectionDialog}
                                        color="primary"
                                        size='small'
                                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                                    >
                                        <PlusCircle />
                                    </IconButton>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Table Properties */}
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Table Properties
                                </Typography>
                                {
                                    selectedTable?.id && <TableEditForm
                                        tableId={selectedTable?.id}
                                        initialTableData={selectedTable}
                                        adjustedPoints={adjustedPoints}
                                        sections={layoutSections}
                                        onSuccess={handleUpdateSuccess}
                                        onDelete={handleDeleteSuccess}
                                        layOutId={layoutId}
                                    />
                                }
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ width: '65%' }}>
                        <Card sx={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ pb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            Floor Plan - {getLayoutName(layoutId)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <StatusIndicator color="#46D44C" label="Available" />
                                            <StatusIndicator color="#bdbdbd" label="Occupied" />
                                            <StatusIndicator color="#DD8782" label="Inactive" />
                                        </Box>
                                    </Box>
                                    {newTables?.length > 0 && (
                                        <Chip
                                            label={`${newTables?.length} unsaved tables`}
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                </Box>
                            </CardContent>
                            {fetchTablesLoading ? (
                                <Box sx={{
                                    // position: 'absolute',
                                    minHeight: 600,
                                    maxHeight: 600,
                                    minWidth: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                }}>
                                    {/* <CircularProgress /> */}
                                </Box>
                            ) : (
                                <Box
                                    ref={floorPlanRef}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    sx={{
                                        m: 1,
                                        position: 'relative',
                                        bgcolor: '#fafafa',
                                        border: '2px dashed #ddd',
                                        borderRadius: 1,
                                        cursor: isDragging ? 'copy' : 'default',
                                        // overflow: 'auto',
                                        height: 600
                                    }}
                                >
                                    {
                                        allTable?.map((table: TableDetails) => (
                                            <Box
                                                key={table?.id}
                                                onMouseDown={(e) => handleTableMouseDown(e, table)}
                                                onClick={() => handleTableClick(table)}
                                                sx={{
                                                    ...getTableStyle(table),
                                                    cursor: draggingTable?.id === table?.id ? 'grabbing' : 'grab',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                                    },
                                                    // position: 'relative',
                                                }}
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
                                                {table.isNew && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: '-8px',
                                                            right: '-8px',
                                                            width: '16px',
                                                            height: '16px',
                                                            backgroundColor: '#4caf50',
                                                            borderRadius: '50%',
                                                            border: '2px solid #fff',
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            // <>

                                            //     <Box sx={{
                                            //         position: 'absolute', left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)',
                                            //         backgroundColor: 'red', width: 40, height: 40
                                            //     }}> </Box>
                                            //     <Box sx={{
                                            //         position: 'absolute', left: `${x1}px`, top: `${y1}px`, transform: 'translate(-50%, -50%)',
                                            //         backgroundColor: 'red', width: 40, height: 40
                                            //     }}> </Box>
                                            // </>

                                        ))

                                    }

                                    {allTable?.length === 0 && !fetchTablesLoading && (
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
                    </Box>
                </Box>
                <AddSectionDialog open={addSectionDialog} onClose={handleCancelAddSection} onSubmit={handleAddSection} />

                <Dialog
                    open={clearConfirmDialog}
                    onClose={handleClearCancel}
                    aria-labelledby="clear-confirm-dialog"
                >
                    <DialogTitle id="clear-confirm-dialog">
                        Confirm Clear Layout
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to clear all tables in this section?
                            This action cannot be undone and will permanently delete all tables.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClearCancel} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={clearLayout}
                            color="error"
                            variant="contained"
                            startIcon={<Trash />}
                        >
                            Clear All Tables
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
};

export default ManageTableDetails;