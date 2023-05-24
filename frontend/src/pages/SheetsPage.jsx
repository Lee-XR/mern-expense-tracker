import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { SheetsContext } from '../context/SheetsContext';
import CardGridSkeleton from '../components/skeletons/CardGridSkeleton';

import style from '../styles/sheets/sheetsPage.module.css';

const SheetCardsList = lazy(async () => {
	return Promise.all([
		import('../components/sheets/SheetCardsList'),
		new Promise((resolve) => setTimeout(resolve, 2000))
	]).then(([module]) => module)
});


const SheetsPage = () => {
	const { id: routeId } = useParams();
	const { sheets } = useContext(SheetsContext);

	const [sheet, setSheet] = useState(null);

	// Set sheet from route
	useEffect(() => {
		if (routeId) {
			setSheet(...sheets.filter((sheet) => sheet._id === routeId));
		}
	}, [routeId]);

	return (
		<div className={style.container}>
			{routeId && <Outlet context={[sheet, setSheet]} />}
			{!routeId && (
				<div className={style.wrapper}>
					<h2>Your Sheets</h2>
					<Suspense fallback={<CardGridSkeleton arrayLength={12} />}>
						<SheetCardsList />
					</Suspense>
				</div>
			)}
		</div>
	);
};

export default SheetsPage;
