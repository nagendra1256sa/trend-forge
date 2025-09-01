import * as React from "react";

interface DialogController<T> {
	data?: T;
	handleClose: () => void;
	handleOpen: (data?: T) => void;
	open: boolean;
}

export function useDialog<T = unknown>(): DialogController<T> {
	const [state, setState] = React.useState<{ open: boolean}>({ open: false});

	const handleOpen = React.useCallback(() => {
		setState({ open: true});
	}, []);

	const handleClose = React.useCallback(() => {
		setState({ open: false });
	}, []);

	return {  handleClose, handleOpen, open: state.open };
}
