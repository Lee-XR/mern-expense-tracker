import { useContext } from 'react';

import { UserContext } from '../context/UserContext';

import style from '../styles/profilePage.module.css';
import defaultProfileImg from '../assets/default_profile_img.jpg';

const ProfileInfo = () => {
	const { _id, username, email, createdAt } = useContext(UserContext);

	const convertDateFormat = (dateIn) => {
		const dateToConvert = new Date(dateIn);
		const year = dateToConvert.getFullYear();
		const month = String(dateToConvert.getMonth() + 1).padStart(2, '0');
		const date = String(dateToConvert.getDate()).padStart(2, '0');

		return `${date} / ${month} / ${year}`;
	};

	return (
		<div className={style.profile}>
			<img
				className={style.image}
				src={defaultProfileImg}
			/>

			<div className={style.info}>
				<div className={style.infoRow}>
					<span className={style.infoLabel}>
						<span>Username</span>
						<span>:</span>
					</span>
					<span>{username}</span>
				</div>
				<div className={style.infoRow}>
					<span className={style.infoLabel}>
						<span>E-mail</span>
						<span>:</span>
					</span>
					<span>{email}</span>
				</div>
				<div className={style.infoRow}>
					<span className={style.infoLabel}>
						<span>User ID</span>
						<span>:</span>
					</span>
					<span>{_id}</span>
				</div>
				<div className={style.infoRow}>
					<span className={style.infoLabel}>
						<span>Registered</span>
						<span>:</span>
					</span>
					<span>{convertDateFormat(createdAt)}</span>
				</div>
			</div>
		</div>
	);
};

export default ProfileInfo;
