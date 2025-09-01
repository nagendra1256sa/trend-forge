import type * as React from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface CardProps {
	count: number;
	text: string;
}

export function ClientCards({ count, text }: CardProps): React.JSX.Element {
	return (
		<Card>
			<Stack spacing={1} sx={{ p: 3 }}>
				<Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
					{/* <Avatar sx={{ bgcolor: "transparent" }}>
						<Box
							sx={{
								animation: "pulse ease 750ms infinite",
								borderRadius: "50%",
								p: "4px",
								"@keyframes pulse": {
									"0%": { boxShadow: "none" },
									"100%": { boxShadow: "0px 0px 0px 6px rgba(240, 68, 56, 0.1)" },
								},
							}}
						>
							<Box
								sx={{ bgcolor: "var(--mui-palette-error-main)", borderRadius: "50%", height: "18px", width: "18px" }}
							/>
						</Box>
					</Avatar> */}
					<Typography variant="h5">{count}</Typography>
				</Stack>
				<Typography color="text.secondary" variant="body2">
					{text}
				</Typography>
			</Stack>
		</Card>
	);
}
