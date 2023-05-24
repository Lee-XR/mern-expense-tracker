import { useContext } from 'react';
import { useHandleError, useHandleSuccess } from '../hooks/useHandleResponse';
import axios from 'axios';

import { SheetsContext } from '../context/SheetsContext';

const useDeleteSheet = (sheet_id, user_id) => {
	const { sheetsDispatch } = useContext(SheetsContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const data = {
		_id: sheet_id,
		user_id: user_id,
	};

	return async () => {
		await axios
			.post(
				`sheet/sheets/${sheet_id}/delete`,
				data
			)
			.then((response) => {
				if (response.data.success) {
					sheetsDispatch({ type: 'DELETE_SHEETS', _id: sheet_id });
					
					const title = 'Sheet Deleted'
					const description = 'The sheet has been succesfully deleted.';
					handleSuccess(title, description);
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};
};

export default useDeleteSheet;