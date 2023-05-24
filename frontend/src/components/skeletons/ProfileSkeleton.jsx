import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import style from '../../styles/profilePage.module.css';

const ProfileSkeleton = () => {
	return (
		<div className={style.profile} style={{margin: '0'}}>
			<Skeleton className={style.image} />

			<div className={style.info}>
				<Skeleton  />
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</div>
		</div>
	);
};

export default ProfileSkeleton;
