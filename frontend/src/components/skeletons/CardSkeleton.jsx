import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CardSkeleton = () => {
	return (
		<div
			style={{
				position: 'relative',
				margin: 'auto',
				width: 'max(300px, 100%)',
				height: 'calc(300px * 2.5 / 4)',
				aspectRatio: '4/2.5',
			}}
		>
			<div
				style={{
					padding: '4px 8px',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-evenly',
					background: 'rgb(250, 250, 250)',
					borderRadius: '15px',
					border: '1px solid rgba(50, 50, 50, 0.3)',
				}}
			>
				<Skeleton />
				<Skeleton width={'70%'} />
				<Skeleton width={'70%'} />
				<Skeleton width={'70%'} />
				<Skeleton
					width={'60%'}
					style={{ float: 'right' }}
				/>
			</div>
		</div>
	);
};

export default CardSkeleton;
