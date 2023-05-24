import { useContext } from 'react';
import { useHandleError, useHandleSuccess } from '../hooks/useHandleResponse';
import PropTypes from 'prop-types';
import useGetTimeLeft from '../hooks/useGetTimeLeft';
import axios from 'axios';

import { UserContext } from '../context/UserContext';
import { SheetsContext } from '../context/SheetsContext';
import { ActionFormContext } from '../context/ActionFormContext';
import SettingsButton from './SettingsButton';

import style from '../styles/components/budgetItem.module.css';

const BudgetItem = (props) => {
	const { budget, sheet_id } = props;
	const { _id } = useContext(UserContext);
	const { sheetsDispatch } = useContext(SheetsContext);
	const { setOpenActionForm, setActionForm } = useContext(ActionFormContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();
	const getTimeLeft = useGetTimeLeft();

	const convertDateFormat = (budgetDate) => {
		const dateToConvert = new Date(budgetDate);
		const year = dateToConvert.getFullYear();
		const month = String(dateToConvert.getMonth() + 1).padStart(2, '0');
		const date = String(dateToConvert.getDate()).padStart(2, '0');
		return `${year}-${month}-${date}`
	}

	const data = {
		user_id: _id,
		sheet_id: sheet_id,
		_id: budget._id
	}

	const editBudget = () => {
		setOpenActionForm(true);
		setActionForm({
			type: 'UPDATE_BUDGET',
			payload: {
				...budget,
				start: convertDateFormat(budget.start),
				end: convertDateFormat(budget.end)
			},
			sheet_id: sheet_id,
		});
	}

	const settingsMenuOptions = [
		{
			name: 'Edit',
			icon: 'edit',
			callback: () => {
				editBudget();
			},
		},
		{
			name: 'Delete',
			icon: 'delete',
			callback: async () => {
				await axios
					.post(`sheet/sheets/${sheet_id}/budget/delete`, data)
					.then((response) => {
						if (response.data.success) {
							sheetsDispatch({ type: 'UPDATE_SHEETS', payload: response.data.sheet });
	
							const title = 'Budget Deleted';
							const description = 'The budget has been successfully deleted.';
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
		top: 4,
		right: 4,
	};

	return (
		<li
			key={budget._id}
			className={style.budgetItem}
		>
			<span className={style.budgetName}>{budget.name}</span>
			<span>
				<span className={style.budgetCurrency}>RM </span>
				{parseFloat(budget.current.$numberDecimal).toFixed(2)}
				<span className={style.budgetDivider}> / </span>
				{parseFloat(budget.target.$numberDecimal).toFixed(2)}
			</span>
			<span
				className={style.budgetBar}
				style={{
					'--progress-width': `calc(${budget.current.$numberDecimal} / ${budget.target.$numberDecimal} * 100%)`,
				}}
			></span>
			<span className={style.budgetTimeLeft}>{getTimeLeft(budget.end)}</span>

			<SettingsButton
				settingsMenuPosition={settingsMenuPosition}
				settingsMenuOptions={settingsMenuOptions}
			/>
		</li>
	);
};

BudgetItem.propTypes = {
	budget: PropTypes.object,
	sheet_id: PropTypes.string
};

export default BudgetItem;
