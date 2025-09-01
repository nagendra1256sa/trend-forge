import type { Components } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

import type { Theme } from "../types";

export const MuiTableHead = {
	styleOverrides: {
		root: {
			[`& .${tableCellClasses.root}`]: {
				backgroundColor: "var(--mui-palette-background-level1)",
				// color: "var(--mui-palette-text-secondary)",
				color: "var(--mui-palette-text-primary)",
				frontWeight: 600,
				lineHeight: 1,
        zIndex:99,
			},
		},
	},
} satisfies Components<Theme>["MuiTableHead"];
