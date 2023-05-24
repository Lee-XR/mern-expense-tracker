import { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserContext } from '../context/UserContext.jsx';

import style from '../styles/components/header.module.css';
import defaultProfileImg from '../assets/default_profile_img.jpg';

const Header = (props) => {
	const { isNavOpen, toggleNav } = props;
	const { username, email } = useContext(UserContext);

	return (
		<header className={style.container}>
			<div>
				<button
					className={style.navBtn}
					onClick={toggleNav}
				>
					{isNavOpen ? (
						<span className='material-symbols-outlined'>menu_open</span>
					) : (
						<span className='material-symbols-outlined'>menu</span>
					)}
				</button>
				<h1>Income & Expense Tracker</h1>
			</div>

			<Link
				to={'profile'}
				style={
					!isNavOpen
						? {
								opacity: '100%',
								transform: 'translateX(20%)',
								visibility: 'visible'
						  }
						: {}
				}
			>
				<img
					src={defaultProfileImg}
					className={style.profileIcon}
				/>
				<div className={style.profileInfo}>
					<span>{username}</span>
					<span>{email}</span>
				</div>
			</Link>
		</header>
	);
};

Header.propTypes = {
	isNavOpen: PropTypes.bool,
	toggleNav: PropTypes.func,
};

export default Header;
