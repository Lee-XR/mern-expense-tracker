import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	useHandleError,
	useHandleSuccess,
} from '../hooks/useHandleResponse';
import useDeleteSheet from '../hooks/useDeleteSheet';
import useOutsideClick from '../hooks/useOutsideClick';
import useGetAmount from '../hooks/useGetAmount';
import useLastUpdated from '../hooks/useLastUpdated';
import useConvertToCurrency from '../hooks/useConvertToCurrency';
import PropTypes from 'prop-types';
import axios from 'axios';

import { SheetsContext } from '../context/SheetsContext.jsx';
import SettingsButton from './SettingsButton';

import style from '../styles/components/sheetCardContent.module.css';

const SheetCardContent = (props) => {
	const { sheet } = props;
	const { sheetsDispatch } = useContext(SheetsContext);

	const navigate = useNavigate();
	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const [title, setTitle] = useState(sheet.title);
	const [oldTitle, setOldTitle] = useState(title);
	const [editTitle, setEditTitle] = useState(false);

	const settingsMenuOptions = [
		{
			name: 'View',
			icon: 'visibility',
			callback: () => {
				navigate(`../sheets/${sheet._id}`);
			},
		},
		{
			name: 'Rename',
			icon: 'edit',
			callback: () => {
				setEditTitle(!editTitle);
			},
		},
		{
			name: 'Delete',
			icon: 'delete',
			callback: useDeleteSheet(sheet._id, sheet.user_id),
		},
	];
	const settingsMenuPosition = {
		top: '8px',
		right: '4px',
	};

	const debitAmount = useGetAmount(sheet.records, 'debit');
	const creditAmount = useGetAmount(sheet.records, 'credit');
	const lastUpdated = useLastUpdated(sheet.updatedAt);
	const convertToCurrency = useConvertToCurrency();

	// Update sheet title in DB
	const updateTitle = async (e) => {
		if (e.keyCode === 13 && e.code === 'Enter') {
			setEditTitle(false);
			const data = {
				...sheet,
				title: e.target.value,
			};

			await axios
				.patch(`sheet/sheets/${sheet._id}`, data)
				.then((response) => {
					if (response.data.success) {
						const sheet = response.data.sheet;
						sheetsDispatch({ type: 'UPDATE_SHEETS', payload: sheet });
						setTitle(sheet.title);
						setOldTitle(sheet.title);

						const title = 'Sheet Title Updated';
						const description =
							'The sheet title has been successfully updated.';
						handleSuccess(title, description);
					}
				})
				.catch((error) => {
					handleError(error);
				});
		}
	};

	// Click outside to remove text input focus
	const ref = useOutsideClick(() => {
		setTitle(oldTitle);
		setEditTitle(false);
	});

	// Change title if sheet changes
	useEffect(() => {
		setTitle(sheet.title);
		setOldTitle(sheet.title);
	}, [sheet]);

	// Focus on input when edit title
	useEffect(() => {
		if (editTitle) ref.current.focus();
	}, [editTitle, ref]);

	return (
		<>
			<div className={style.container}>
				{/* Link to sheet OR text input to change title */}
				{editTitle ? (
					<input
						type='text'
						placeholder='Sheet Title'
						value={title}
						disabled={!editTitle}
						ref={ref}
						onChange={(e) => setTitle(e.target.value)}
						onBlur={() => {
							setTitle(oldTitle);
							setEditTitle(false);
						}}
						onKeyDown={updateTitle}
					/>
				) : (
					<Link
						to={`../sheets/${sheet._id}`}
						className={style.title}
					>
						<span>{title || 'Untitled'}</span>
						<span className='material-symbols-outlined'>open_in_new</span>
					</Link>
				)}

				<div className={style.content}>
					<div>
						<span>Debit (+): </span>
						<span>{convertToCurrency(debitAmount)}</span>
					</div>
					<div>
						<span>Credit (-): </span>
						<span>{convertToCurrency(creditAmount)}</span>
					</div>
					<div>
						<span>Balance : </span>
						<span>{convertToCurrency(sheet.balance.$numberDecimal)}</span>
					</div>
				</div>
				<div className={style.timestamp}>
					<span>Last Updated: {lastUpdated} ago</span>
				</div>

				{/* Settings menu button */}
				<SettingsButton
					settingsMenuPosition={settingsMenuPosition}
					settingsMenuOptions={settingsMenuOptions}
				/>
			</div>
		</>
	);
};

SheetCardContent.propTypes = {
	sheet: PropTypes.object,
};

export default SheetCardContent;
