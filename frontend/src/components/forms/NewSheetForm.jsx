import { useContext, useEffect, useState } from 'react';
import { useHandleError, useHandleSuccess } from '../../hooks/useHandleResponse';
import axios from 'axios';

import { UserContext } from '../../context/UserContext.jsx';
import { SheetsContext } from '../../context/SheetsContext.jsx';
import { ActionFormContext } from '../../context/ActionFormContext.jsx';

import style from '../../styles/components/actionForm.module.css';

const NewSheetForm = () => {
	const { _id } = useContext(UserContext);
	const { sheetsDispatch } = useContext(SheetsContext);
	const { openActionForm } = useContext(ActionFormContext);
	const [newSheetTitle, setNewSheetTitle] = useState('');

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const addNewSheet = async (e) => {
		e.preventDefault();

		const data = {
			user_id: _id,
			title: newSheetTitle,
		};

		await axios
			.post('sheet/sheets/add', data)
			.then((response) => {
				if (response.data.success) {
					sheetsDispatch({ type: 'ADD_NEW_SHEETS', payload: response.data.sheet });
	
					const title = 'Sheet Added'
					const description = 'The new sheet has been successfully added.';
					handleSuccess(title, description);
	
					setNewSheetTitle('');
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	useEffect(() => {
		setNewSheetTitle('');
	}, [openActionForm]);

	return (
		<div className={style.formItem}>
			<h2>New Sheet</h2>
			<form onSubmit={addNewSheet}>
				<div className={style.inputItem}>
					<label htmlFor='new-sheet-title'>New Sheet Title:</label>
					<input
						type='text'
						name='new-sheet-title'
						id='new-sheet-title'
						value={newSheetTitle}
						onChange={(e) => setNewSheetTitle(e.target.value)}
						required
						aria-required
					/>
				</div>

				<button className={style.submitButton}>Add</button>
			</form>
		</div>
	);
};

export default NewSheetForm;
