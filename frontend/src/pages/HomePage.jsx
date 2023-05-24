import { Suspense, lazy } from 'react';

import Skeleton from 'react-loading-skeleton';
import CardListSkeleton from '../components/skeletons/CardListSkeleton';

import style from '../styles/home/homePage.module.css';

const SheetsSection = lazy(async () => {
	return Promise.all([
		import('../components/home/SheetsSection.jsx'),
		new Promise((resolve) => setTimeout(resolve, 3000)),
	]).then(([module]) => module);
});
const BudgetsSection = lazy(async () => {
	return Promise.all([
		import('../components/home/BudgetsSection.jsx'),
		new Promise((resolve) => setTimeout(resolve, 3000)),
	]).then(([module]) => module);
});

const HomePage = () => {
	return (
		<div className={style.container}>
			{/* Display user's sheets */}
			<section>
				<h2>Your Sheets</h2>
				<Suspense
					fallback={<CardListSkeleton arrayLength={5} />}
				>
					<SheetsSection />
				</Suspense>
			</section>
			{/* Display user's budgets */}
			<section>
				<h2>Your Budgets</h2>
				<Suspense fallback={<Skeleton count={2} height={20} />}>
					<BudgetsSection />
				</Suspense>
			</section>
		</div>
	);
};

export default HomePage;
