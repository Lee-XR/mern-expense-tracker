import { useContext } from 'react';

import { SheetsContext } from '../../context/SheetsContext';
import Card from '../Card';
import SheetCardContent from '../SheetCardContent';

import style from '../../styles/sheets/sheetsPage.module.css';

const SheetCardsList = () => {
	const { sheets } = useContext(SheetsContext);

	return (
		<>
			{sheets.length > 0 ? (
				<div className={style.allSheetsContainer}>
					{sheets.map((sheet) => (
						<Card key={sheet._id}>
							<SheetCardContent sheet={sheet} />
						</Card>
					))}
				</div>
			) : (
				<p className={style.emptyData}>No sheets added yet.</p>
			)}
		</>
	);
};

export default SheetCardsList;
