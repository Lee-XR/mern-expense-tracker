import { useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import SettingsMenu from './SettingsMenu';

import style from '../styles/components/settingsButton.module.css';

const SettingsButton = (props) => {
	const { settingsMenuPosition, settingsMenuOptions } = props;

	const [openMenu, setOpenMenu] = useState(false);
	const [menuPosition, setMenuPosition] = useState({
		top: 0,
		left: 0,
	});
	const [menuHeight, setMenuHeight] = useState(0);

	// Toggle settings menu
	const toggleSettings = (e) => {
		if (!openMenu) {
			const bound = e?.target.getBoundingClientRect();
			let top = bound?.top + bound?.width / 2 || 0;
			let left = bound?.left + bound?.width / 2 - 150 || 0;

			if (top + menuHeight > window.innerHeight) {
				top = top - menuHeight;
			}

			setMenuPosition({
				top: top + window.scrollY,
				left: left + window.scrollX,
			});
		}
		setOpenMenu(!openMenu);
	};

	return (
		<>
			<button
				style={settingsMenuPosition}
				className={style.settingsBtn}
				onClick={toggleSettings}
				disabled={openMenu}
			>
				<span className='material-symbols-outlined'>more_vert</span>
			</button>

			{/* Toggle settings menu  */}
			{openMenu &&
				createPortal(
					<SettingsMenu
						menuPosition={menuPosition}
						setMenuHeight={setMenuHeight}
						closeBtnCallback={toggleSettings}
						settingsMenuOptions={settingsMenuOptions}
					/>,
					document.body
				)}
		</>
	);
};

SettingsButton.propTypes = {
	settingsMenuPosition: PropTypes.object,
	settingsMenuOptions: PropTypes.array,
};

export default SettingsButton;
