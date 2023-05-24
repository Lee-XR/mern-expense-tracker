import { useContext } from 'react';
import { useHandleError } from '../hooks/useHandleResponse';
import axios from 'axios';

import { UserContext } from '../context/UserContext';
import { SheetsContext } from '../context/SheetsContext';

const useFetchSheets = () => {
	const { _id } = useContext(UserContext);
	const { sheetsDispatch } = useContext(SheetsContext);

	const handleError = useHandleError();

	return async () => {
		await axios
			.post('sheet/sheets/', { _id: _id })
			.then((response) => {
				if (response.data.success) {
					const sheets = response.data.sheets;
					sheetsDispatch({ type: 'GET_SHEETS', payload: [...sheets] });
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};
};

export default useFetchSheets;
