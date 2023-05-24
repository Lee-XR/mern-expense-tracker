import { useContext, useEffect, useState } from 'react';
import {
	useHandleError,
	useHandleSuccess,
} from '../../hooks/useHandleResponse';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { SheetsContext } from '../../context/SheetsContext';
import { ActionFormContext } from '../../context/ActionFormContext';
import * as Select from '@radix-ui/react-select';

import style from '../../styles/components/actionForm.module.css';

const NewBudgetForm = () => {
	const { _id } = useContext(UserContext);
	const { sheets, sheetsDispatch } = useContext(SheetsContext);
	const { openActionForm } = useContext(ActionFormContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const [selectedSheet, setSelectedSheet] = useState('');
	const [newBudgetType, setNewBudgetType] = useState('');
	const [newBudgetName, setNewBudgetName] = useState('');
	const [newBudgetCurrent, setNewBudgetCurrent] = useState(
		parseFloat(0).toFixed(2)
	);
	const [newBudgetTarget, setNewBudgetTarget] = useState(
		parseFloat(0).toFixed(2)
	);
	const [newBudgetStart, setNewBudgetStart] = useState('');
	const [newBudgetEnd, setNewBudgetEnd] = useState('');

	const [minDate, setMinDate] = useState('');
	const [maxDate, setMaxDate] = useState('');

	const clearInputs = () => {
		setSelectedSheet('');
		setNewBudgetType('');
		setNewBudgetName('');
		setNewBudgetCurrent(0);
		setNewBudgetTarget(0);
		setNewBudgetStart('');
		setNewBudgetEnd('');
	};

	const selectSheet = (selectedId) => {
		setSelectedSheet(...sheets.filter((sheet) => sheet._id === selectedId));
	};

	const selectBudgetType = (selectedType) => {
		setNewBudgetType(selectedType);
	};

	const addNewBudget = async (e) => {
		e.preventDefault();

		const data = {
			user_id: _id,
			sheet_id: selectedSheet._id,
			type: newBudgetType,
			name: newBudgetName,
			current: newBudgetCurrent,
			target: newBudgetTarget,
			start: newBudgetStart,
			end: newBudgetEnd,
		};

		await axios
			.post(`sheet/sheets/${selectedSheet._id}/budget`, data)
			.then((response) => {
				if (response.data.success) {
					sheetsDispatch({
						type: 'UPDATE_SHEETS',
						payload: response.data.sheet,
					});

					const title = 'Budget Added';
					const description = 'The new budget has been successfully added.';
					handleSuccess(title, description);

					clearInputs();
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	useEffect(() => {
		setMinDate(new Date(newBudgetStart).toLocaleDateString('fr-ca'));

		switch (newBudgetType) {
			case 'daily': {
				setMaxDate(new Date(newBudgetStart).toLocaleDateString('fr-ca'));
				break;
			}

			case 'weekly': {
				const max = new Date(newBudgetStart);
				max.setDate(max.getDate() + 7);
				setMaxDate(new Date(max).toLocaleDateString('fr-ca'));
				break;
			}

			case 'monthly': {
				const max = new Date(newBudgetStart);
				max.setDate(max.getDate() + 31);
				setMaxDate(new Date(max).toLocaleDateString('fr-ca'));
				break;
			}
		}
	}, [newBudgetType, newBudgetStart]);

	useEffect(() => {
		clearInputs();
	}, [openActionForm]);

	return (
		<div className={style.formItem}>
			<h2>New Budget</h2>
			<form onSubmit={addNewBudget}>
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
					<label htmlFor='new-budget-type'>Budget Type:</label>
					<Select.Root onValueChange={selectBudgetType}>
						<Select.Trigger
							className={style.selectTrigger}
							aria-label='Sheets'
						>
							<Select.Value placeholder='Select a budget type' />
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
									<Select.Item
										className={style.selectItem}
										value='daily'
									>
										<Select.ItemText>Daily</Select.ItemText>
										<Select.ItemIndicator className={style.selectItemIndicator}>
											<span className='material-symbols-outlined'>check</span>
										</Select.ItemIndicator>
									</Select.Item>
									<Select.Item
										className={style.selectItem}
										value='weekly'
									>
										<Select.ItemText>Weekly</Select.ItemText>
										<Select.ItemIndicator className={style.selectItemIndicator}>
											<span className='material-symbols-outlined'>check</span>
										</Select.ItemIndicator>
									</Select.Item>
									<Select.Item
										className={style.selectItem}
										value='monthly'
									>
										<Select.ItemText>Monthly</Select.ItemText>
										<Select.ItemIndicator className={style.selectItemIndicator}>
											<span className='material-symbols-outlined'>check</span>
										</Select.ItemIndicator>
									</Select.Item>
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
					<label htmlFor='new-budget-name'>Budget Name:</label>
					<input
						type='text'
						name='new-budget-name'
						id='new-budget-name'
						value={newBudgetName}
						onChange={(e) => setNewBudgetName(e.target.value)}
						required
						aria-required
					/>
				</div>

				<div className={style.inputOneRow}>
					<div className={style.inputItem}>
						<label htmlFor='new-budget-current'>Current Amount:</label>
						<input
							type='number'
							name='new-budget-current'
							id='new-budget-current'
							value={newBudgetCurrent}
							onChange={(e) => setNewBudgetCurrent(e.target.value)}
							step={0.01}
							min={0}
							required
							aria-required
						/>
					</div>
					<div className={style.inputItem}>
						<label htmlFor='new-budget-target'>Target Amount:</label>
						<input
							type='number'
							name='new-budget-target'
							id='new-budget-target'
							value={newBudgetTarget}
							onChange={(e) => setNewBudgetTarget(e.target.value)}
							step={0.01}
							min={0}
							required
							aria-required
						/>
					</div>
				</div>

				<div className={style.inputOneRow}>
					<div className={style.inputItem}>
						<label htmlFor='new-budget-start'>Start Date:</label>
						<input
							type='date'
							name='new-budget-start'
							id='new-budget-start'
							value={newBudgetStart}
							onChange={(e) => setNewBudgetStart(e.target.value)}
							required
							aria-required
						/>
					</div>
					<div className={style.inputItem}>
						<label htmlFor='new-budget-end'>End Date:</label>
						<input
							type='date'
							name='new-budget-end'
							id='new-budget-end'
							value={newBudgetEnd}
							onChange={(e) => setNewBudgetEnd(e.target.value)}
							min={minDate}
							max={maxDate}
							required
							aria-required
						/>
					</div>
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

export default NewBudgetForm;
