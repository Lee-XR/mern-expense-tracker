import PropTypes from 'prop-types';
import CardSkeleton from './CardSkeleton';

const CardListSkeleton = (props) => {
    const { arrayLength } = props;
	const array = Array.from({ length: arrayLength }, (_, index) => index + 1);

    return ( 
        <div
			style={{
				margin: 0,
				padding: '8px 8px 12px',
				height: '100%',
				display: 'flex',
                gap: '16px',
                overflow: 'hidden'
			}}
		>
            {array.map((item) => (
                <CardSkeleton key={item} />
            ))}
        </div>
     );
}

CardListSkeleton.propTypes = {
    arrayLength: PropTypes.number
}
 
export default CardListSkeleton;