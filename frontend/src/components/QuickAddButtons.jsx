import { useContext, useState } from 'react';

import { ActionFormContext } from '../context/ActionFormContext';
import QuickButton from './QuickButton';

const QuickAddButtons = () => {
	// const { setActionForm, toggleActionForm, setToggleActionForm } = props;
	const { openActionForm, setOpenActionForm, setActionForm} = useContext(ActionFormContext);
	const [toggleQuickBtns, setToggleQuickBtns] = useState(false);

	const quickBtnsOptions = [
		{
			id: 0,
			name: 'Quick Add',
			icon: 'add',
			callback: () => {
				setToggleQuickBtns(!toggleQuickBtns);
			},
		},
		{
			id: 1,
			name: 'New Sheet',
			icon: 'note_add',
			callback: (form) => {
				toggleActionForm(form);
			},
			form: 'NEW_SHEET',
		},
		{
			id: 2,
			name: 'New Debit',
			icon: 'add_box',
			callback: (form) => {
				toggleActionForm(form);
			},
			form: 'NEW_DEBIT',
		},
		{
			id: 3,
			name: 'New Credit',
			icon: 'indeterminate_check_box',
			callback: (form) => {
				toggleActionForm(form);
			},
			form: 'NEW_CREDIT',
		},
		{
			id: 4,
			name: 'New Budget',
			icon: 'savings',
			callback: (form) => {
				toggleActionForm(form);
			},
			form: 'NEW_BUDGET',
		},
	];

	// Open / close action form
	const toggleActionForm = (form) => {
		setOpenActionForm(!openActionForm);
		setActionForm({type: form});
	};

	return (
		<div className='quick-btns'>
			{quickBtnsOptions.length > 0 &&
				quickBtnsOptions.map((button) => (
					<QuickButton
						key={button.id}
						button={button}
						toggleQuickBtns={toggleQuickBtns}
					/>
				))}
		</div>
	);
};

export default QuickAddButtons;
