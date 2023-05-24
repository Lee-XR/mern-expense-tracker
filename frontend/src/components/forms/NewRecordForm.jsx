import { useContext, useEffect, useState } from 'react';
import {
	useHandleError,
	useHandleSuccess,
} from '../../hooks/useHandleResponse';
import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { SheetsContext } from '../../context/SheetsContext';
import { ActionFormContext } from '../../context/ActionFormContext';
import * as Select from '@radix-ui/react-select';

import style from '../../styles/components/actionForm.module.css';

const NewRecordForm = (props) => {
	const { type } = props;
	const { _id } = useContext(UserContext);
	const { sheets, sheetsDispatch } = useContext(SheetsContext);
	const { openActionForm } = useContext(ActionFormContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const [selectedSheet, setSelectedSheet] = useState('');
	const [newRecordDate, setNewRecordDate] = useState('');
	const [newRecordTitle, setNewRecordTitle] = useState('');
	const [newRecordReference, setNewRecordReference] = useState('');
	const [newRecordAmount, setNewRecordAmount] = useState(
		parseFloat(0).toFixed(2)
	);

	const clearInputs = () => {
		setSelectedSheet('');
		setNewRecordDate('');
		setNewRecordTitle('');
		setNewRecordReference('');
		setNewRecordAmount(parseFloat(0).toFixed(2));
	};

	const selectSheet = (selectedId) => {
		setSelectedSheet(...sheets.filter((sheet) => sheet._id === selectedId));
	};

	const addNewRecord = async (e) => {
		e.preventDefault();

		const data = {
			user_id: _id,
			sheet_id: selectedSheet._id,
			type: type,
			date: newRecordDate,
			transaction: newRecordTitle,
			reference: newRecordReference,
			amount: newRecordAmount,
		};

		await axios
			.post(`sheet/sheets/${selectedSheet._id}/record`, data)
			.then((response) => {
				if (response.data.success) {
					sheetsDispatch({
						type: 'UPDATE_SHEETS',
						payload: response.data.sheet,
					});

					const title = `${type} Added`;
					const description = `The new ${type} record has been successfully added.`;
					handleSuccess(title, description);

					clearInputs();
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	useEffect(() => {
		clearInputs();
	}, [openActionForm]);

	return (
		<div className={style.formItem}>
			<h2>New {type}</h2>
			<form onSubmit={addNewRecord}>
				<div className={style.inputItem}>
					<label htmlFor='selected-sheet'>Select your sheet:</label>
					<Select.Root
						required
						onValueChange={selectSheet}
						disabled={sheets.length === 0}
					>
						<Select.Trigger
							className={style.selectTrigger}
							aria-label='Sheets'
						>
							<Select.Value placeholder='Select a sheet' />
							<Select.Icon>
								<span className='material-symbols-outlined'>
									arrow_drop_down
								</span>
							</Select.Icon>
						</Select.Trigger>

						<Select.Portal>
							<Select.Content
								className={style.selectContent}
								position='popper'
								sideOffset={4}
							>
								<Select.ScrollUpButton
									className={`${style.selectScrollButton} ${style.btnUp}`}
								>
									<span className='material-symbols-outlined'>
										keyboard_arrow_up
									</span>
								</Select.ScrollUpButton>
								<Select.Viewport className={style.selectViewport}>
									{sheets.map((sheet) => (
										<Select.Item
											className={style.selectItem}
											key={sheet._id}
											value={sheet._id}
										>
											<Select.ItemText>{sheet.title}</Select.ItemText>
											<Select.ItemIndicator
												className={style.selectItemIndicator}
											>
												<span className='material-symbols-outlined'>check</span>
											</Select.ItemIndicator>
										</Select.Item>
									))}
								</Select.Viewport>
								<Select.ScrollDownButton
									className={`${style.selectScrollButton} ${style.btnDown}`}
								>
									<span className='material-symbols-outlined'>
										keyboard_arrow_down
									</span>
								</Select.ScrollDownButton>
								<Select.Arrow />
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='new-record-date'>Date:</label>
					<input
						type='date'
						name='new-record-date'
						id='new-record-date'
						value={newRecordDate}
						onChange={(e) => setNewRecordDate(e.target.value)}
						required
						aria-required
					/>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='new-record-title'>Record Title:</label>
					<input
						type='text'
						name='new-record-title'
						id='new-record-title'
						value={newRecordTitle}
						onChange={(e) => setNewRecordTitle(e.target.value)}
						required
						aria-required
					/>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='new-record-reference'>Reference:</label>
					<input
						type='text'
						name='new-record-title'
						id='new-record-reference'
						value={newRecordReference}
						onChange={(e) => setNewRecordReference(e.target.value)}
					/>
				</div>

				<div className={style.inputItem}>
					<label htmlFor='new-record-amount'>Amount:</label>
					<input
						type='number'
						name='new-record-amount'
						id='new-record-amount'
						value={newRecordAmount}
						onChange={(e) => setNewRecordAmount(e.target.value)}
						step={0.01}
						min={0}
						required
						aria-required
					/>
				</div>

				<button
					className={style.submitButton}
					disabled={sheets.length === 0}
				>
					Add
				</button>
			</form>
		</div>
	);
};

NewRecordForm.propTypes = {
	type: PropTypes.string,
};

export default NewRecordForm;
