import { useContext, useEffect, useState } from 'react';
import { useHandleError, useHandleSuccess } from '../../hooks/useHandleResponse';
import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import { SheetsContext } from '../../context/SheetsContext';
import * as Select from '@radix-ui/react-select';

import style from '../../styles/components/actionForm.module.css';

const UpdateBudgetForm = (props) => {
	const { budget, sheet_id } = props;
	const { _id } = useContext(UserContext);
	const { sheetsDispatch } = useContext(SheetsContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

    const [updatedBudgetType, setUpdatedBudgetType] = useState('');
    const [updatedBudgetName, setUpdatedBudgetName] = useState('');
    const [updatedBudgetCurrent, setUpdatedBudgetCurrent] = useState(0);
    const [updatedBudgetTarget, setUpdatedBudgetTarget] = useState(0);
    const [updatedBudgetStart, setUpdatedBudgetStart] = useState('');
    const [updatedBudgetEnd, setUpdatedBudgetEnd] = useState('');

    const [minDate, setMinDate] = useState('');
	const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        setUpdatedBudgetType(budget.type);
        setUpdatedBudgetName(budget.name);
        setUpdatedBudgetCurrent(parseFloat(budget.current.$numberDecimal).toFixed(2));
        setUpdatedBudgetTarget(parseFloat(budget.target.$numberDecimal).toFixed(2));
        setUpdatedBudgetStart(budget.start);
        setUpdatedBudgetEnd(budget.end);
    }, [budget]);

    useEffect(() => {
		setMinDate(new Date(updatedBudgetStart).toLocaleDateString('fr-ca'));

		switch(updatedBudgetType) {
			case 'daily': {
				setMaxDate(new Date(updatedBudgetStart).toLocaleDateString('fr-ca'));
				break;
			}

			case 'weekly': {
				const max = new Date(updatedBudgetStart);
				max.setDate(max.getDate() + 7);
				setMaxDate(new Date(max).toLocaleDateString('fr-ca'));
				break;
			}
			
			case 'monthly': {
				const max = new Date(updatedBudgetStart);
				max.setDate(max.getDate() + 31);
				setMaxDate(new Date(max).toLocaleDateString('fr-ca'));
				break;
			}
		}
	}, [updatedBudgetType, updatedBudgetStart]);

	const selectBudgetType = (selectedType) => {
		setUpdatedBudgetType(selectedType);
	}

	const updateBudget = async (e) => {
        e.preventDefault();
        const data = {
            user_id: _id,
            sheet_id: sheet_id,
            _id: budget._id,
            type: updatedBudgetType,
            name: updatedBudgetName,
            current: updatedBudgetCurrent,
            target: updatedBudgetTarget,
            start: updatedBudgetStart,
            end: updatedBudgetEnd
        }

        await axios.patch(`sheet/sheets/${sheet_id}/budget`, data)
            .then((response) => {
				if (response.data.success) {
					sheetsDispatch({type: 'UPDATE_SHEETS', payload: response.data.sheet});
	
					const title = 'Budget Updated';
					const description = 'The budget has been successfully updated.';
					handleSuccess(title, description);
				}
            })
            .catch((error) => {
                handleError(error)
            })
    };

	return (
		<div className={style.formItem}>
			<h2>Update Budget</h2>
			<form onSubmit={updateBudget}>
				<div className={style.inputItem}>
					<label htmlFor='updated-budget-type'>Budget Type:</label>
					<Select.Root value={updatedBudgetType} onValueChange={selectBudgetType}>
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
							<Select.Content className={style.selectContent}>
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
					<label htmlFor='updated-budget-name'>Budget Name:</label>
					<input
						type='text'
						name='updated-budget-name'
						id='updated-budget-name'
						value={updatedBudgetName}
						onChange={(e) => setUpdatedBudgetName(e.target.value)}
						required
						aria-required
					/>
				</div>

				<div className={style.inputOneRow}>
					<div className={style.inputItem}>
						<label htmlFor='updated-budget-current'>Current Amount:</label>
						<input
							type='number'
							name='updated-budget-current'
							id='updated-budget-current'
							value={updatedBudgetCurrent}
							onChange={(e) => setUpdatedBudgetCurrent(e.target.value)}
							step={0.01}
							min={0}
							required
							aria-required
						/>
					</div>
					<div className={style.inputItem}>
						<label htmlFor='updated-budget-target'>Target Amount:</label>
						<input
							type='number'
							name='updated-budget-target'
							id='updated-budget-target'
							value={updatedBudgetTarget}
							onChange={(e) => setUpdatedBudgetTarget(e.target.value)}
							step={0.01}
							min={0}
							required
							aria-required
						/>
					</div>
				</div>

				<div className={style.inputOneRow}>
					<div className={style.inputItem}>
						<label htmlFor='updated-budget-start'>Start Date:</label>
						<input
							type='date'
							name='updated-budget-start'
							id='updated-budget-start'
							value={updatedBudgetStart}
							onChange={(e) => setUpdatedBudgetStart(e.target.value)}
							required
							aria-required
						/>
					</div>
					<div className={style.inputItem}>
						<label htmlFor='updated-budget-end'>End Date:</label>
						<input
							type='date'
							name='updated-budget-end'
							id='updated-budget-end'
							value={updatedBudgetEnd}
							onChange={(e) => setUpdatedBudgetEnd(e.target.value)}
							min={minDate}
							max={maxDate}
							required
							aria-required
						/>
					</div>
				</div>

				<button className={style.submitButton}>Update</button>
			</form>
		</div>
	);
};

UpdateBudgetForm.propTypes = {
	budget: PropTypes.object,
	sheet_id: PropTypes.string,
};

export default UpdateBudgetForm;
