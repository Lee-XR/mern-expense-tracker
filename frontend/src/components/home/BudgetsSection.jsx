import { useContext, useEffect, useReducer, useState } from 'react';

import { SheetsContext } from '../../context/SheetsContext';
import * as Select from '@radix-ui/react-select';
import BudgetItem from '../BudgetItem';

import style from '../../styles/home/budgetsSection.module.css';

const budgetsInitState = {
	daily: [],
	weekly: [],
	monthly: [],
};

const budgetsReducer = (state, action) => {
	switch (action.type) {
		case 'budgetsExists': {
			return {
				daily: [...action.daily],
				weekly: [...action.weekly],
				monthly: [...action.monthly],
			};
		}

		case 'noBudgets': {
			return budgetsInitState;
		}

		default: {
			return budgetsInitState;
		}
	}
};

const BudgetsSection = () => {
	const { sheets } = useContext(SheetsContext);
	const [selectedSheet, setSelectedSheet] = useState(null);
	const [budgetsState, dispatchBudgets] = useReducer(
		budgetsReducer,
		budgetsInitState
	);

	// Select sheet to view
	const selectSheet = (selectedId) => {
		setSelectedSheet(...sheets.filter((sheet) => sheet._id === selectedId));
	};

	// Display updated selected sheet data
	useEffect(() => {
		if (selectedSheet) {
			selectSheet(selectedSheet._id);
		}
	}, [sheets]);

	// Display budgets for selected sheet
	useEffect(() => {
		if (selectedSheet) {
			dispatchBudgets({
				type: 'budgetsExists',
				daily: [
					...selectedSheet.budgets
						.filter((budget) => budget.type === 'daily')
						.sort((a, b) => {
							if (a._id < b._id) return -1;
							if (a._id > b._id) return 1;
							return 0;
						}),
				],
				weekly: [
					...selectedSheet.budgets
						.filter((budget) => budget.type === 'weekly')
						.sort((a, b) => {
							if (a._id < b._id) return -1;
							if (a._id > b._id) return 1;
							return 0;
						}),
				],
				monthly: [
					...selectedSheet.budgets
						.filter((budget) => budget.type === 'monthly')
						.sort((a, b) => {
							if (a._id < b._id) return -1;
							if (a._id > b._id) return 1;
							return 0;
						}),
				],
			});
		} else {
			dispatchBudgets({ type: 'noBudgets' });
		}
	}, [selectedSheet]);

	return (
		<div className={style.container}>
			{/* Sheet selector */}
			<div className={style.selector}>
				<label htmlFor='sheet-selection'>Select your sheets:</label>
				<Select.Root onValueChange={selectSheet} disabled={sheets.length === 0}>
					<Select.Trigger
						className={style.selectTrigger}
						aria-label='Sheets'
					>
						<Select.Value placeholder='Select a sheet' />
						<Select.Icon>
							<span className='material-symbols-outlined'>arrow_drop_down</span>
						</Select.Icon>
					</Select.Trigger>

					<Select.Portal>
						<Select.Content className={style.selectContent}>
							<Select.ScrollUpButton className={`${style.selectScrollButton} ${style.btnUp}`}>
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
										<Select.ItemIndicator className={style.selectItemIndicator}>
											<span className='material-symbols-outlined'>check</span>
										</Select.ItemIndicator>
									</Select.Item>
								))}
							</Select.Viewport>
							<Select.ScrollDownButton className={`${style.selectScrollButton} ${style.btnDown}`}>
								<span className='material-symbols-outlined'>
									keyboard_arrow_down
								</span>
							</Select.ScrollDownButton>
							<Select.Arrow />
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>

			{sheets.length > 0 ? (
				selectedSheet !== null ? (
					<div className={style.wrapper}>
						<div className={style.budgetCol}>
							<h3>Daily</h3>
							{budgetsState.daily.length > 0 ? (
								<ul>
									{budgetsState.daily.map((budget) => (
										<BudgetItem
											key={budget._id}
											budget={budget}
										/>
									))}
								</ul>
							) : (
								<div className={style.emptyData}>
									<p>No budget added yet.</p>
								</div>
							)}
						</div>
						<div className={style.budgetCol}>
							<h3>Weekly</h3>
							{budgetsState.weekly.length > 0 ? (
								<ul>
									{budgetsState.weekly.map((budget) => (
										<BudgetItem
											key={budget._id}
											budget={budget}
										/>
									))}
								</ul>
							) : (
								<div className={style.emptyData}>
									<p>No budget added yet.</p>
								</div>
							)}
						</div>
						<div className={style.budgetCol}>
							<h3>Monthly</h3>
							{budgetsState.monthly.length > 0 ? (
								<ul>
									{budgetsState.monthly.map((budget) => (
										<BudgetItem
											key={budget._id}
											budget={budget}
										/>
									))}
								</ul>
							) : (
								<div className={style.emptyData}>
									<p>No budget added yet.</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className={style.emptyData}>
						<p>No sheets selected yet.</p>
					</div>
				)
			) : (
				<div className={style.emptyData}>
					<p>No sheets added yet.</p>
				</div>
			)}
		</div>
	);
};

export default BudgetsSection;
