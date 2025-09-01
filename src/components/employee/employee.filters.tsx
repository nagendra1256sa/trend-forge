"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { FilterButton, FilterPopover, useFilterContext } from "@/components/core/filter-button";
import { Checkbox, ListItemText, MenuItem, Select } from "@mui/material";
import { Role } from "@/models/role";
import { useTranslation } from "react-i18next";


export interface EmployeeFilters {
  empId?: string;
  firstName?: string;
  lastName?: string;
  role?: string[];
  email?: string;
}

export interface EmployeeFiltersProps {
  filters?: EmployeeFilters;
  roles?: Role[];
  isUnAssignedEmpFilter?: boolean
}

export function EmployeeFilters({ filters = {}, roles}: EmployeeFiltersProps): React.JSX.Element {
  const { email, empId, firstName, lastName, role } = filters;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const updateSearchParams = useCallback((newFilters: EmployeeFilters): void => {
    const params = new URLSearchParams(searchParams?.toString());

    if (newFilters.empId) {
      params.set("empId", newFilters.empId);
    } else {
      params.delete("empId");
    }

    if (newFilters.firstName) {
      params.set("firstName", newFilters.firstName);
    } else {
      params.delete("firstName");
    }

    if (newFilters.lastName) {
      params.set("lastName", newFilters.lastName);
    } else {
      params.delete("lastName");
    }

    if (newFilters.email) {
      params.set("email", newFilters.email);
    } else {
      params.delete("email");
    }

    if (Array.isArray(newFilters.role) && newFilters.role.length > 0) {
      params.set("role", newFilters.role.join(","));
    } else {
      params.delete("role");
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);



  const handleEmpIdChange = useCallback((value?: string) => {
    updateSearchParams({ ...filters, empId: value });
  }, [updateSearchParams, filters]);

  const handlefirstNameChange = useCallback((value?: string) => {
    updateSearchParams({ ...filters, firstName: value });
  }, [updateSearchParams, filters]);

  const handlelastNameChange = useCallback((value?: string) => {
    updateSearchParams({ ...filters, lastName: value });
  }, [updateSearchParams, filters]);

  const handleRoleNameChange = useCallback((value?: string[] | undefined) => {
    updateSearchParams({ ...filters, role: value });
  }, [updateSearchParams, filters]);

  const handleEmailChange = useCallback((value?: string) => {
    updateSearchParams({ ...filters, email: value });
  }, [updateSearchParams, filters]);

  const handleClearFilters = useCallback(() => {
    updateSearchParams({});
  }, [updateSearchParams]);

  const hasFilters = Boolean(email || empId || firstName || lastName || (role && role?.length > 0 ));

  return (
    <Box>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
          <FilterButton
            displayValue={empId || undefined}
            label={t("Employee:employee_id")}
            onFilterApply={(value) => {
              handleEmpIdChange(value as string);
            }}
            onFilterDelete={() => {
              handleEmpIdChange();
            }}
            popover={<CommonFilterPopover placeHolder={t("Employee:employee_id")} />}
            value={empId || undefined}
          />

          <FilterButton
            displayValue={firstName || undefined}
            label={t("Employee:first_name")}
            onFilterApply={(value) => {
              handlefirstNameChange(value as string);
            }}
            onFilterDelete={() => {
              handlefirstNameChange();
            }}
            popover={<CommonFilterPopover placeHolder={t("Employee:first_name")} />}
            value={firstName || undefined}
          />

          <FilterButton
            displayValue={lastName || undefined}
            label={t("Employee:last_name")}
            onFilterApply={(value) => {
              handlelastNameChange(value as string);
            }}
            onFilterDelete={() => {
              handlelastNameChange();
            }}
            popover={<CommonFilterPopover placeHolder={t("Employee:last_name")} />}
            value={lastName || undefined}
          />

          <FilterButton
            displayValue={email || undefined}
            label={t("Employee:email")}
            onFilterApply={(value) => {
              handleEmailChange(value as string);
            }}
            onFilterDelete={() => {
              handleEmailChange();
            }}
            popover={<CommonFilterPopover placeHolder={t("Employee:email")} />}
            value={email || undefined}
          />
          {
            roles && roles?.length > 0 &&

            <FilterButton
              displayValue={Array.isArray(role) && role?.length > 0 ? role?.map((id) => roles?.find((role) => role?.id === Number(id))?.name)?.join(', ') : undefined}
              label={t("Employee:role")}
              onFilterApply={(value) => {
                handleRoleNameChange(value as string[]);
              }}
              onFilterDelete={() => {
                handleRoleNameChange();
              }}
              popover={<RoleFilterPopover roles={roles} />}
              value={Array.isArray(role) && role?.length > 0 ? role : undefined}
            />
          }
          {hasFilters ? <Button onClick={handleClearFilters}>{t("Employee:clear_filters")}</Button> : null}
        </Stack>
      </Stack>
    </Box>
  );
};


function RoleFilterPopover({ roles }: { roles: Role[] }): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string[]>([]);
  const { t } = useTranslation();

  React.useEffect(() => {
    setValue((initialValue as string[] | undefined) ?? []);
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title={t("Employee:filter_by_role")}>
      <Select
        multiple
        value={value}
        onChange={(event) => {
          const newValue = event.target.value as string[];
          setValue(newValue); // value contains selected role IDs
        }}
        renderValue={(selectedIds: string[]) => {
          const selectedNames = selectedIds
            .map((id) => roles?.find((role) => role?.id === Number(id))?.name)
            .filter(Boolean);

          const [first, ...rest] = selectedNames;
          return rest?.length > 0 ? `${first} (+${rest?.length} more)` : first || t("Employee:select_a_role");
        }}
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={String(role.id)}>
            <Checkbox checked={value.includes(String(role.id))} />
            <ListItemText primary={role.name} />
          </MenuItem>
        ))}

      </Select>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        {t("Employee:apply")}
      </Button>
    </FilterPopover>
  );
}


function CommonFilterPopover({ placeHolder }: { placeHolder: string }): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = useState<string>("");
  const { t } = useTranslation();
  useEffect(() => {
    setValue((initialValue as string | undefined) ?? "");
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title={`Filter by ${placeHolder}`}>
      <FormControl>
        <OutlinedInput
          placeholder={`Enter ${placeHolder}`}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        {t("Employee:apply")}
      </Button>
    </FilterPopover>
  );
}

// function EmpIdFilterPopover(): React.JSX.Element {
//   const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
//   const [value, setValue] = useState<string>("");

//   useEffect(() => {
//     setValue((initialValue as string | undefined) ?? "");
//   }, [initialValue]);

//   return (
//     <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by SKU">
//       <FormControl>
//         <OutlinedInput
//           placeholder="Enter SKU"
//           onChange={(event) => {
//             setValue(event.target.value);
//           }}
//           onKeyUp={(event) => {
//             if (event.key === "Enter") {
//               onApply(value);
//             }
//           }}
//           value={value}
//         />
//       </FormControl>
//       <Button
//         onClick={() => {
//           onApply(value);
//         }}
//         variant="contained"
//       >
//         Apply
//       </Button>
//     </FilterPopover>
//   );
// }
