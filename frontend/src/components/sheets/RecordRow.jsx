import { memo, useContext } from 'react';
import { useHandleError, useHandleSuccess } from '../../hooks/useHandleResponse';
import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { SheetsContext } from '../../context/SheetsContext';
import { ActionFormContext } from '../../context/ActionFormContext';
import SettingsButton from '../SettingsButton';

import style from '../../styles/sheets/individualSheet.module.css';

const RecordRow = memo((props) => {
	const { record, sheet_id } = props;
	const { _id } = useContext(UserContext);
	const { sheetsDispatch } = useContext(SheetsContext);
	const { setOpenActionForm, setActionForm } = useContext(ActionFormContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const newDate = new Date(record.date);
	const year = newDate.getFullYear();
	const month = String(newDate.getMonth() + 1).padStart(2, '0');
	const date = String(newDate.getDate()).padStart(2, '0');
	const recordDate = `${date} / ${month} / ${year}`;

	const data = {
		_id: record._id,
		user_id: _id,
		sheet_id: sheet_id,
	};

	const editRecord = () => {
		setOpenActionForm(true);
		setActionForm({
			type: 'UPDATE_RECORD',
			payload: {
				...record,
				date: `${year}-${month}-${date}`
			},
			sheet_id: sheet_id,
		});
	};

	const settingsMenuOptions = [
		{
			name: 'Edit',
			icon: 'edit',
			callback: () => {
				editRecord();
			},
		},
		{
			name: 'Delete',
			icon: 'delete',
			callback: async () => {
				await axios
					.post(`sheet/sheets/${sheet_id}/record/delete`, data)
					.then((response) => {
						if (response.data.success) {
							sheetsDispatch({ type: 'UPDATE_SHEETS', payload: response.data.sheet });
	
							const title = 'Record Deleted';
							const description = 'The record has been successfully deleted.';
							handleSuccess(title, description);
						}
					})
					.catch((error) => {
						handleError(error);
					});
			},
		},
	];
	const settingsMenuPosition = {
		top: 0,
		bottom: 0,
		right: 0,
	};

	return (
		<div
			className={style.recordRow}
			tabIndex={0}
		>
			<span className={style.dateCol}>{recordDate}</span>
			<span className={style.itemCol}>
				<span className={style.transactionName}>{record.transaction}</span>
				<span className={style.recordSettingsBtn}>
					<SettingsButton
						settingsMenuPosition={settingsMenuPosition}
						settingsMenuOptions={settingsMenuOptions}
					/>
				</span>
			</span>
			<span className={style.refCol}>{record.reference || 'N/A'}</span>
			<span className={style.amountCol}>
				{parseFloat(record.amount.$numberDecimal).toFixed(2)}
			</span>
		</div>
	);
});

RecordRow.propTypes = {
	record: PropTypes.object,
	sheet_id: PropTypes.string,
};

RecordRow.displayName = 'RecordRow';

export default RecordRow;
