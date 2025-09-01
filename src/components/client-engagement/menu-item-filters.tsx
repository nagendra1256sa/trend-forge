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

export interface MenuItemFilters {
  name?: string;
  sku?: string;
}

export interface MenuFiltersProps {
  filters?: MenuItemFilters;
}

export function MenuFilters({ filters = {} }: MenuFiltersProps): React.JSX.Element {
  const { name, sku } = filters;

  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback((newFilters: MenuItemFilters): void => {
    const params = new URLSearchParams(searchParams?.toString());

    if (newFilters.name) {
      params.set("name", newFilters.name);
    } else {
      params.delete("name");
    }

    if (newFilters.sku) {
      params.set("sku", newFilters.sku);
    } else {
      params.delete("sku");
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleNameChange = useCallback((value?: string) => {
    updateSearchParams({ ...filters, name: value });
  }, [updateSearchParams, filters]);

  const handleSkuChange = useCallback((value?: string) => {
    updateSearchParams({ ...filters, sku: value });
  }, [updateSearchParams, filters]);

  const handleClearFilters = useCallback(() => {
    updateSearchParams({});
  }, [updateSearchParams]);

  const hasFilters = Boolean(name || sku);

  return (
    <Box>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flex: "1 1 auto", flexWrap: "wrap" }}>
          <FilterButton
            displayValue={name || undefined}
            label="Menu Item Name"
            onFilterApply={(value) => {
              handleNameChange(value as string);
            }}
            onFilterDelete={() => {
              handleNameChange();
            }}
            popover={<NameFilterPopover />}
            value={name || undefined}
          />

          <FilterButton
            displayValue={sku || undefined}
            label="SKU"
            onFilterApply={(value) => {
              handleSkuChange(value as string);
            }}
            onFilterDelete={() => {
              handleSkuChange();
            }}
            popover={<SkuFilterPopover />}
            value={sku || undefined}
          />

          {hasFilters ? <Button onClick={handleClearFilters}>Clear Filters</Button> : null}
        </Stack>
      </Stack>
    </Box>
  );
}

function NameFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue((initialValue as string | undefined) ?? "");
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Menu Item Name">
      <FormControl>
        <OutlinedInput
          placeholder="Enter menu item name"
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
        Apply
      </Button>
    </FilterPopover>
  );
}

function SkuFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue((initialValue as string | undefined) ?? "");
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by SKU">
      <FormControl>
        <OutlinedInput
          placeholder="Enter SKU"
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
        Apply
      </Button>
    </FilterPopover>
  );
}
