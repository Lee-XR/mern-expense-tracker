import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { UserContext } from '../context/UserContext.jsx';
import { useHandleError, useHandleSuccess } from '../hooks/useHandleResponse.jsx';
import useOutsideClick from '../hooks/useOutsideClick';

import style from '../styles/components/navbar.module.css';
import defaultProfileImg from '../assets/default_profile_img.jpg';

const NavBar = (props) => {
	const { _id, username, email, userDispatch } =
		useContext(UserContext);
	const { isScreenSmaller, isNavOpen, toggleNav } = props;

	const navigate = useNavigate();
	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const userLogout = async () => {
		const data = { _id };

		await axios
			.post('user/logout', data)
			.then((response) => {
				if (response.data.success) {
					userDispatch({ type: 'USER_LOGOUT' });
					navigate('/login');

					const title = `Goodbye ${username}`;
					const description = 'User has successfully logged out.'
					handleSuccess(title, description);
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	const ref = useOutsideClick(toggleNav);

	return (
		<div
			className={style.container}
			ref={isScreenSmaller && isNavOpen ? ref : null}
			style={
				isNavOpen
					? { width: '250px', transform: 'translateX(0)' }
					: {
							width: 0,
							overflow: 'hidden',
							visibility: 'hidden',
					  }
			}
		>
			{isScreenSmaller && (
				<button
					id={style.closeMenuButton}
					onClick={toggleNav}
				>
					<span className='material-symbols-outlined'>menu_open</span>
				</button>
			)}

			<div>
				{/* User info top */}
				<div className={style.userInfo}>
					<img
						src={defaultProfileImg}
						className={style.userPic}
					></img>
					<div className={style.userText}>
						<span className={style.userName}>{username}</span>
						<span className={style.userEmail}>{email}</span>
					</div>
				</div>

				{/* Navigation links */}
				<nav>
					<ul>
						<li>
							<span className='material-symbols-outlined'>dashboard</span>
							<NavLink to={``}>Home</NavLink>
						</li>
						<li>
							<span className='material-symbols-outlined'>article</span>
							<NavLink to={`sheets`}>Sheets</NavLink>
						</li>
						<li>
							<span className='material-symbols-outlined'>person</span>
							<NavLink to={`profile`}>Profile</NavLink>
						</li>
					</ul>
				</nav>
			</div>

			{/* Logout button */}
			<button
				className={style.logoutBtn}
				onClick={userLogout}
			>
				<span className='material-symbols-outlined'>logout</span>
				<div>
					<span>Logout</span>
				</div>
			</button>
		</div>
	);
};

NavBar.propTypes = {
	isScreenSmaller: PropTypes.bool,
	isNavOpen: PropTypes.bool,
	toggleNav: PropTypes.func,
};

export default NavBar;
