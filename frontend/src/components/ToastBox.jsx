import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import * as Toast from '@radix-ui/react-toast';

import { ToastContext } from '../context/ToastContext';

import style from '../styles/components/toastBox.module.css';

const ToastBox = (props) => {
	const { id, error, title, description } = props.options;
	const { toastDispatch } = useContext(ToastContext);

	const [open, setOpen] = useState(true);

	// Auto remove toast from array
	useEffect(() => {
		if (!open) {
			const closeToast = setTimeout(() => {
				toastDispatch({ type: 'REMOVE_TOAST', id: id });
			}, 500);

			return () => clearTimeout(closeToast);
		}
	}, [open]);

	return (
		<>
			<Toast.Root
				className={style.toastRoot}
				style={error && { '--status-color': 'red' }}
				open={open}
				onOpenChange={setOpen}
			>
				<div className={style.toastTip}></div>
				<div className={style.toastText}>
					<Toast.Title className={style.toastTitle}>{title}</Toast.Title>
					<Toast.Description className={style.toastDescription}>
						{description}
					</Toast.Description>
				</div>
				<Toast.Close className={style.toastClose}>
					<span className='material-symbols-outlined'>close</span>
				</Toast.Close>
			</Toast.Root>

			<Toast.Viewport className={style.toastViewport} />
		</>
	);
};

ToastBox.propTypes = {
	options: PropTypes.object,
};

export default ToastBox;
