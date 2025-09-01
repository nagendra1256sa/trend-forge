import React, { useEffect, useState } from "react";
import {
	Button,
	Container,
	FormControl,
	InputLabel,
	Modal,
	OutlinedInput,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { X } from "@phosphor-icons/react";
import { toast } from "sonner";

import { useReauthenticate } from "@/hooks/employee-hooks/use-reauthenticate";

interface ReauthenticationPopupProps {
	open: boolean;
	close: () => void;
	onSuccess?: () => void;
}

const ReAuthenticationPopUp = ({ open, close, onSuccess }: ReauthenticationPopupProps) => {
	const [password, setPassword] = useState("");
	const { reauth, isLoading, error, response } = useReauthenticate();

	const handleSubmit = async () => {
		if (!password.trim()) {
			return;
		}

		try {
			await reauth({
				password,
				id: 2,
			});
		} catch (error) {
			console.error("Reauthentication error:", error);
		}
	};

	useEffect(() => {
		if (response?.success) {
			setPassword("");
			close();
			onSuccess?.();
			toast.success(response?.message);
		}
	}, [response, close, onSuccess]);

	if (error) {
		toast.error(error);
	}
	const handleClose = () => {
		setPassword("");
		close();
	};
	useEffect(() => {
		if (open) {
			setPassword("");
		}
	}, [open]);
	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" && !isLoading) {
			handleSubmit();
		}
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="reauthentication-title"
			sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
		>
			<Container
				maxWidth="sm"
				sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", p: 2 }}
			>
				<Paper
					sx={{
						width: "100%",
						maxWidth: 1000,
						p: 3,
						borderRadius: 2,
						boxShadow: 6,
						outline: "none",
						maxHeight: "90vh",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
						<Typography id="reauthentication-title" variant="h6" fontWeight={600}>
							Reauthentication
						</Typography>
						<Button onClick={handleClose} color="secondary" sx={{ p: 1 }} disabled={isLoading}>
							<X size={22} />
						</Button>
					</Stack>

					<Stack spacing={2}>
						<FormControl fullWidth variant="outlined">
							<InputLabel htmlFor="password-input">Password</InputLabel>
							<OutlinedInput
								id="password-input"
								type="password"
								label="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyPress={handleKeyPress}
								disabled={isLoading}
								autoFocus
							/>
						</FormControl>

						<Stack direction="row" justifyContent="flex-end" spacing={2}>
							<Button variant="outlined" onClick={handleClose} disabled={isLoading}>
								Cancel
							</Button>
							<Button variant="contained" onClick={handleSubmit} disabled={isLoading || !password.trim()}>
								{isLoading ? "Authenticating..." : "Submit"}
							</Button>
						</Stack>
					</Stack>
				</Paper>
			</Container>
		</Modal>
	);
};

export default ReAuthenticationPopUp;
