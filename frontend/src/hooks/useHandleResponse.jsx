import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export const useHandleError = () => {
	const { toastDispatch } = useContext(ToastContext);

	return (error) => {
		let title = '';
		let description = '';
		if (error.response) {
			title = `${error.response.status} ${error.response.statusText}`;
			description = error.response.data;
		} else if (error.request) {
			title = error.code;
			description = `${error.message}. Please try again.`;
		} else {
			title = 'Error';
			description = `${error.message}. Please try again.`;
		}

		toastDispatch({
			type: 'ADD_TOAST',
			payload: {
				error: true,
				title: title,
				description: description,
			},
		});
	};
};

export const useHandleSuccess = () => {
	const { toastDispatch } = useContext(ToastContext);

	return (title, description) => {
		toastDispatch({
			type: 'ADD_TOAST',
			payload: {
				error: false,
				title: title,
				description: description,
			},
		});
	};
};
