import { useContext, useEffect, useRef, useState } from 'react';

import { SheetsContext } from '../../context/SheetsContext.jsx';
import Card from '../Card.jsx';
import SheetCardContent from '../SheetCardContent.jsx'

import style from '../../styles/home/sheetsSection.module.css';

const SheetsSection = () => {
	const { sheets } = useContext(SheetsContext);
	const [moreSheets, setMoreSheets] = useState(false);
	const [lessSheets, setLessSheets] = useState(false);

	const carouselWrapper = useRef();

	// Set linear gradient fade for card display and carousel button display
	const checkIfScrolled = () => {
		const scrollLeft = carouselWrapper.current.scrollLeft;
		const offsetWidth = carouselWrapper.current.offsetWidth;
		const scrollWidth = carouselWrapper.current.scrollWidth;

		if (scrollLeft === 0) {
			setMoreSheets(true);
			setLessSheets(false);
		} else {
			if (scrollLeft < scrollWidth) {
				setMoreSheets(true);
				setLessSheets(true);
			}

			if (offsetWidth + scrollLeft >= scrollWidth) {
				setMoreSheets(false);
				setLessSheets(true);
			}
		}
	};

	const scrollCarousel = (e) => {
		const btn = e.currentTarget.dataset.carouselBtns;
		if (btn === 'left') carouselWrapper.current.scrollLeft -= 300;
		if (btn === 'right') carouselWrapper.current.scrollLeft += 300;
	};

	useEffect(() => {
		checkIfScrolled();
	}, []);

	return (
		<div
			className={style.container}
		>
			<button
				data-carousel-btns='left'
				style={
					lessSheets
						? { visibility: 'visible' }
						: { visibility: 'hidden', opacity: '0' }
				}
				onClick={scrollCarousel}
			>
				<span className='material-symbols-outlined'>chevron_left</span>
			</button>

			<button
				data-carousel-btns='right'
				style={
					sheets.length > 0 && moreSheets
						? { visibility: 'visible' }
						: { visibility: 'hidden', opacity: '0' }
				}
				onClick={scrollCarousel}
			>
				<span className='material-symbols-outlined'>chevron_right</span>
			</button>

			{lessSheets && (
				<span
					className={style.wrapperEndFade}
					style={{
						left: 0,
						WebkitMaskImage:
							'linear-gradient(to right, black 10%, transparent 100%)',
					}}
				></span>
			)}

			<div
				className={style.wrapper}
				ref={carouselWrapper}
				onScroll={checkIfScrolled}
			>
				{sheets.length > 0 ? (
					sheets.map((sheet) => (
						<div
							key={sheet._id}
							style={{ maxWidth: '300px' }}
						>
							<Card>
								<SheetCardContent sheet={sheet} />
							</Card>
						</div>
					))
				) : (
					<p className={style.emptyData}>No sheets added yet.</p>
				)}
			</div>

			{moreSheets && (
				<span
					className={style.wrapperEndFade}
					style={{
						right: 0,
						WebkitMaskImage:
							'linear-gradient(to left, black 10%, transparent 100%)',
					}}
				></span>
			)}
		</div>
	);
};

export default SheetsSection;
