import { useContext, useEffect, useReducer } from 'react';

import { ActionFormContext } from '../../context/ActionFormContext';
import useOutsideClick from '../../hooks/useOutsideClick';
import NewSheetForm from './NewSheetForm';
import NewRecordForm from './NewRecordForm';
import NewBudgetForm from './NewBudgetForm';
import UpdateRecordForm from './UpdateRecordForm';
import UpdateBudgetForm from './UpdateBudgetForm';
import UpdateProfileForm from './UpdateProfileForm';
import DeleteProfileForm from './DeleteProfileForm';

import style from '../../styles/components/actionForm.module.css';

const formReducer = (state, action) => {
	switch (action.type) {
		case 'NEW_SHEET':
			return <NewSheetForm />;

		case 'NEW_DEBIT':
			return <NewRecordForm type={'debit'} />;

		case 'NEW_CREDIT':
			return <NewRecordForm type={'credit'} />;

		case 'NEW_BUDGET':
			return <NewBudgetForm />;

		case 'UPDATE_RECORD': {
			return (
				<UpdateRecordForm
					record={action.payload}
					sheet_id={action.sheet_id}
				/>
			)
		}

		case 'UPDATE_BUDGET':
			return (
				<UpdateBudgetForm
					budget={action.payload}
					sheet_id={action.sheet_id}
				/>
			)

		case 'UPDATE_PROFILE':
			return <UpdateProfileForm />

		case 'DELETE_PROFILE':
			return <DeleteProfileForm />

		default:
			return null;
	}
};

const ActionForm = () => {
	const { actionForm, openActionForm, setOpenActionForm } =
		useContext(ActionFormContext);
	const [formState, formDispatch] = useReducer(formReducer, null);

	useEffect(() => {
		if (actionForm) {
			formDispatch({
				type: actionForm.type,
				payload: actionForm.payload,
				sheet_id: actionForm.sheet_id,
			});
		}
	}, [actionForm]);

	const ref = useOutsideClick(() => {
		// setOpenActionForm(false);
	});

	return (
		<div
			className={style.container}
			style={
				openActionForm
					? { visibility: 'visible' }
					: { visibility: 'hidden', opacity: 0, transitionDelay: '450ms' }
			}
		>
			<div
				ref={ref}
				className={style.form}
				style={
					openActionForm
						? { width: 'min(80%, 500px)', height: 'min(600px, 90%)' }
						: { width: 0, height: 0, opacity: 0, transitionDelay: 0 }
				}
			>
				{/* Close form button */}
				<button
					className={style.closeFormBtn}
					onClick={() => setOpenActionForm(false)}
				>
					<span className='material-symbols-outlined'>close</span>
				</button>

				{/* Display selected form */}
				{formState}
			</div>
		</div>
	);
};

export default ActionForm;
