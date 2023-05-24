import PropTypes from 'prop-types';

import style from '../styles/components/quickButton.module.css';

const QuickButton = (props) => {
	const { button, toggleQuickBtns } = props;

	return (
		<>
			<button
				tabIndex={1}
				className={style.container}
				style={
					button.id > 0 && !toggleQuickBtns
						? { '--item-no': button.id, top: '88px', visibility: 'hidden' }
						: { '--item-no': button.id }
				}
				onClick={() => button.callback(button.form)}
			>
				<span
					className='material-symbols-outlined'
					style={
						button.id === 0 && toggleQuickBtns
							? { transform: 'rotate(-45deg)' }
							: {}
					}
				>
					{button.icon}
				</span>

				{/* Tooltip */}
				<div className={style.tooltip}>{button.name}</div>
			</button>
		</>
	);
};

QuickButton.propTypes = {
	button: PropTypes.object,
	toggleQuickBtns: PropTypes.bool,
};

export default QuickButton;
