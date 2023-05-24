import PropTypes from 'prop-types';

import BudgetItem from '../BudgetItem';

import style from '../../styles/sheets/individualSheet.module.css';
import { memo } from 'react';

const BudgetSlide = memo((props) => {
	const { budgets, type, sheet_id } = props;

	return (
		<div className={style.budgetsSlide}>
			<h4>{type}</h4>
			{budgets.length > 0 && (
				<ul>
					{budgets
						.sort((a, b) => {
							if (a.start < b.start) return -1;
							if (a.start > b.start) return 1;
							return 0;
						})
						.map((budget) => (
							<BudgetItem
								key={budget._id}
								budget={budget}
								sheet_id={sheet_id}
							/>
						))}
				</ul>
			)}

			{budgets.length === 0 && (
				<div className={style.budgetEmptyData}>
					<p className={style.emptyData}>No budget added yet.</p>
				</div>
			)}
		</div>
	);
});

BudgetSlide.propTypes = {
	budgets: PropTypes.array,
	type: PropTypes.string,
	sheet_id: PropTypes.string
};

BudgetSlide.displayName = 'BudgetSlide';

export default BudgetSlide;