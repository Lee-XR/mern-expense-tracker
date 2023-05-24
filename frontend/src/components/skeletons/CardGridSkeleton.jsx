import PropTypes from 'prop-types';

import CardSkeleton from './CardSkeleton';

import style from '../../styles/sheets/sheetsPage.module.css';

const CardGridSkeleton = (props) => {
	const { arrayLength } = props;
	const array = Array.from({ length: arrayLength }, (_, index) => index + 1);

	return (
		<div className={style.allSheetsContainer}>
			{array.map((item) => (
				<CardSkeleton key={item} />
			))}
		</div>
	);
};

CardGridSkeleton.propTypes = {
	arrayLength: PropTypes.number,
};

export default CardGridSkeleton;
