import { Suspense, lazy, useContext } from 'react';

import { ActionFormContext } from '../context/ActionFormContext';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';

import style from '../styles/profilePage.module.css';

const ProfileInfo = lazy(async () => {
	return Promise.all([
		import('../components/ProfileInfo'),
		new Promise((resolve) => setTimeout(resolve, 1000))
	]).then(([module]) => module);
});

const ProfilePage = () => {
	const { setOpenActionForm, setActionForm } = useContext(ActionFormContext);
	
	// Open edit user profile form
	const editProfile = () => {
		setOpenActionForm(true);
		setActionForm({ type: 'UPDATE_PROFILE' });
	};

	// Open delete user profile form
	const deleteProfile = () => {
		setOpenActionForm(true);
		setActionForm({ type: 'DELETE_PROFILE' });
	};

	return (
		<div className={style.container}>
			<h2>Your Profile</h2>
			<Suspense fallback={<ProfileSkeleton />}>
				<ProfileInfo />
			</Suspense>
			<div className={style.profileButtons}>
				<button onClick={editProfile}>
					<span className='material-symbols-outlined'>edit</span>
					<div>
						<span>Edit</span>
					</div>
				</button>
				<button onClick={deleteProfile}>
					<span className='material-symbols-outlined'>delete</span>
					<div>
						<span>Delete</span>
					</div>
				</button>
			</div>
		</div>
	);
};

export default ProfilePage;
