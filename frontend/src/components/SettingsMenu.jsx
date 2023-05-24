import PropTypes from 'prop-types';
import useOutsideClick from '../hooks/useOutsideClick';

import style from '../styles/components/settingsMenu.module.css';
import { useEffect } from 'react';

const SettingsMenu = (props) => {
	const { menuPosition, setMenuHeight, closeBtnCallback, settingsMenuOptions } =
		props;

	const toggleOption = (callback) => {
		callback();
		closeBtnCallback();
	}

	const ref = useOutsideClick(closeBtnCallback);

	useEffect(() => {
		if (ref) {
			const bound = ref.current.getBoundingClientRect();
			setMenuHeight(bound.height);
		}
	}, [ref]);

	return (
		<div
			ref={ref}
			className={style.container}
			style={{ top: menuPosition.top, left: menuPosition.left }}
		>
			<ul>
				{settingsMenuOptions.map((option) => (
					<li key={option.name}>
						<button
							onClick={() => { toggleOption(option.callback) }}
						>
							<span className='material-symbols-outlined'>{option.icon}</span>
							<span>{option.name}</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

SettingsMenu.propTypes = {
	menuPosition: PropTypes.object,
	setMenuHeight: PropTypes.func,
	closeBtnCallback: PropTypes.func,
	settingsMenuOptions: PropTypes.array,
};

export default SettingsMenu;
