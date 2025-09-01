import { useEmployeeContext } from "@/contexts/employee-context";
import { useGetRoles } from "@/hooks/employee-hooks/get-roles";
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import FallbackLoader from "../fallback-loader/loader";

const EmployeeAssignRole = () => {
    const { assignedEmployee } = useEmployeeContext();
    const {setSelectedRole, selectedRole} = useEmployeeContext();
    const {t} = useTranslation();
     const { roles, loading: roleLoading } = useGetRoles()

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedRole(Number(event?.target?.value));
  };
    return (
      <Box sx={{ maxWidth: 600, paddingLeft:"16px" }}>
        {
            roleLoading &&
           <FallbackLoader/>
        }
            <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                    mb: 1,
                    mt: 3,
                    fontWeight: 600,
                    color: 'text.primary'
                }}
            >
                {t('Employee:selected_employee_title')}
            </Typography>

            {/* Employee List Section */}
            <Box sx={{
                 maxHeight: 200,
                 width: '100%',
                 overflowY: 'auto',
                 border: '1px solid',
                 borderColor: 'grey.300',
                 borderRadius: "4px",
                 p: 1,
                 pl:2,
                 mb:3,
                 mt:3,
                 }}>
                <Typography 
                    variant="subtitle2" 
                    sx={{ 
                        mb: 1, 
                        color: 'text.secondary',
                        fontWeight: 500
                    }}
                >
                   {t('Employee:select_employee')} ({assignedEmployee?.length}):
                </Typography>
                
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {assignedEmployee?.map((employee) => (
                            <Chip
                                key={employee?.id}
                                label={`${employee?.first_name} ${employee?.last_name}`}
                                variant="outlined"
                                sx={{
                                    borderColor: '#e0e0e0',
                                    color: '#3b3b3b',
                                    backgroundColor: 'white',
                                    borderRadius:"30px",
                                    fontWeight:"400",
                                    pl:"10px",
                                    pr:"10px",
                                    // '&:hover': {
                                    //     backgroundColor: 'primary.50',
                                    // }
                                }}
                            />
                        ))}
                    </Stack>
            </Box>

            {/* Role Selection Section */}
            <Box sx={{ mt: 3 }}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel 
                        id="role-select-label"
                        sx={{ 
                            fontWeight: 500,
                            '&.Mui-focused': {
                                color: 'primary.main'
                            }
                        }}
                    >
                        Role
                    </InputLabel>
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        value={String(selectedRole)}
                        label="Role"
                        onChange={handleChange}
                        sx={{
                            width:"50%",
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'grey.300',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'primary.main',
                                borderWidth: 2,
                            }
                        }}
                    >
                        {
                            roles?.map((role) => (
                                <MenuItem key={role?.id} value={role?.id}>
                                    {role?.name}
                                </MenuItem>
                            ))
                        }
                        
                    </Select>
                </FormControl>
            </Box>
        </Box>
    )
};

export default EmployeeAssignRole;