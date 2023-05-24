const timeDivs = [3.154e7, 2.628e6, 604800, 86400, 3600, 60];
const units = ['year', 'month', 'week', 'day', 'hour', 'minute'];

const useLastUpdated = (time) => {
	const diffInSeconds = Math.floor((new Date() - new Date(time)) / 1000);

	for (let i = 0; i < timeDivs.length; i++) {
		if (diffInSeconds > timeDivs[i]) {
			return Math.floor(diffInSeconds / timeDivs[i]) + ` ${units[i]}(s)`;
		}
	}

	return diffInSeconds + ' seconds(s)';
};

export default useLastUpdated;
