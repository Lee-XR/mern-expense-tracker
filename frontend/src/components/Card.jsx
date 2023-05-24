import PropTypes from 'prop-types';

import style from '../styles/components/card.module.css';

const Card = (props) => {
	return (
		<div className={style.parent}>
			<div className={style.container}>{props.children}</div>
			<div className={style.containerShadow}></div>
		</div>
	);
};

Card.propTypes = {
	children: PropTypes.node,
};

export default Card;
