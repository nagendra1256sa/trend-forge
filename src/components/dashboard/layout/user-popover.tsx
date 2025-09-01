"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { paths } from "@/paths";
import { useAuthContext } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

// const user = {
// 	id: "USR-000",
// 	name: "Sofia Rivers",
// 	avatar: "/assets/avatar.png",
// 	email: "sofia@devias.io",
// } as const;

function SignOutButton(): React.JSX.Element {
	const router = useRouter();
	const auth = useAuthContext();

	const handleSignOut = async (event: React.MouseEvent): Promise<void> => {
		event.preventDefault();
		try {
			await auth?.logout();
			router.push(paths.home);
		} catch (error) {
			console.error('Sign out error:', error);
		}
	};

	return (
		<MenuItem onClick={handleSignOut} sx={{ justifyContent: "center" }}>
			Sign out
		</MenuItem>
	);
}

export interface UserPopoverProps {
	anchorEl: null | Element;
	onClose?: () => void;
	open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
	const userDetails = localStorage.getItem('userDetails');
	const parsedUser = userDetails ? JSON.parse(userDetails) : null;

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
			onClose={onClose}
			open={Boolean(open)}
			slotProps={{ paper: { sx: { width: "280px" } } }}
			transformOrigin={{ horizontal: "right", vertical: "top" }}
		>
			<Box sx={{ p: 2 }}>
				<Typography>{parsedUser?.username || 'User'}</Typography>
				<Typography color="text.secondary" variant="body2">
					{parsedUser?.label || 'No label'}
				</Typography>
			</Box>
			<Divider />
			{/* <List sx={{ p: 1 }}>
					<MenuItem component={RouterLink} href={paths.dashboard.settings.account} onClick={onClose}>
						<ListItemIcon>
							<UserIcon />
						</ListItemIcon>
						Account
					</MenuItem>
					<MenuItem component={RouterLink} href={paths.dashboard.settings.security} onClick={onClose}>
						<ListItemIcon>
							<LockKeyIcon />
						</ListItemIcon>
						Security
					</MenuItem>
					<MenuItem component={RouterLink} href={paths.dashboard.settings.billing} onClick={onClose}>
						<ListItemIcon>
							<CreditCardIcon />
						</ListItemIcon>
						Billing
					</MenuItem>
			</List>
			<Divider /> */}
			<Box sx={{ p: 1 }}>
				<SignOutButton />
			</Box>
		</Popover>
	);
}