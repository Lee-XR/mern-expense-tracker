import { useContext, useEffect, useState } from 'react';
import { useHandleError, useHandleSuccess } from '../../hooks/useHandleResponse';
import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { SheetsContext }  from '../../context/SheetsContext';

import style from '../../styles/components/actionForm.module.css';

const UpdateRecordForm = (props) => {
	const { record, sheet_id } = props;
	const { _id } = useContext(UserContext);
	const { sheetsDispatch } = useContext(SheetsContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const [updatedRecordDate, setUpdatedRecordDate] = useState('');
	const [updatedRecordTitle, setUpdatedRecordTitle] = useState('');
	const [updatedRecordReference, setUpdatedRecordReference] = useState('');
	const [updatedRecordAmount, setUpdatedRecordAmount] = useState(0);

	useEffect(() => {
		setUpdatedRecordDate(record.date);
		setUpdatedRecordTitle(record.transaction);
		setUpdatedRecordReference(record.reference);
		setUpdatedRecordAmount(parseFloat(record.amount.$numberDecimal).toFixed(2));
	}, [record]);

	const updateRecord = async (e) => {
		e.preventDefault();
		const data = {
			user_id: _id,
			sheet_id: sheet_id,
			_id: record._id,
			type: record.type,
			date: updatedRecordDate,
			transaction: updatedRecordTitle,
			reference: updatedRecordReference,
			amount: updatedRecordAmount
		}

		await axios.patch(`sheet/sheets/${record._id}/record`, data)
			.then((response) => {
				if (response.data.success) {
					sheetsDispatch({type: 'UPDATE_SHEETS', payload: response.data.sheet});
	
					const title = 'Record Updated';
					const description = 'The record has been successfully updated.';
					handleSuccess(title, description);
				}
			})
			.catch((error) => {
				handleError(error);
			})
	};

	return (
		<div className={style.formItem}>
			<h2>Update {record.type}</h2>
			<form onSubmit={updateRecord}>
				<div className={style.inputItem}>
					<label htmlFor='updated-record-date'>Date:</label>
					<input
						type='date'
						name='updated-record-date'
						id='updated-record-date'
						value={updatedRecordDate}
						onChange={(e) => setUpdatedRecordDate(e.target.value)}
						required
						aria-required
					/>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='updated-record-title'>Record Title:</label>
					<input
						type='text'
						name='updated-record-title'
						id='updated-record-title'
						value={updatedRecordTitle}
						onChange={(e) => setUpdatedRecordTitle(e.target.value)}
						required
						aria-required
					/>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='updated-record-reference'>Reference:</label>
					<input
						type='text'
						name='updated-record-title'
						id='updated-record-reference'
						value={updatedRecordReference}
						onChange={(e) => setUpdatedRecordReference(e.target.value)}
					/>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='updated-record-amount'>Amount:</label>
					<input
						type='number'
						name='updated-record-amount'
						id='updated-record-amount'
						value={updatedRecordAmount}
						onChange={(e) => setUpdatedRecordAmount(e.target.value)}
						step={0.01}
						min={0}
						required
						aria-required
					/>
				</div>

				<button className={style.submitButton}>Update</button>
			</form>
		</div>
	);
};

UpdateRecordForm.propTypes = {
	record: PropTypes.object,
	sheet_id: PropTypes.string,
};

export default UpdateRecordForm;
