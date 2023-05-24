import { useMemo } from 'react';

const useGetAmount = (records, type) => {
	return useMemo(() => {
		if (records) {
			return records
				.filter((record) => record.type === type)
				.reduce((acc, val) => {
					return acc + parseFloat(val.amount.$numberDecimal);
				}, 0);
		}
		return null;
	}, [records, type]);
};

export default useGetAmount;
