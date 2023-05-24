
const timeDivs = [604800, 86400, 3600, 60];
const units = ['week', 'day', 'hour', 'minute'];

const useGetTimeLeft = () => {
	return (endTime) => {
		const maxEndTime = new Date(endTime);
		maxEndTime.setHours(23, 59, 59, 999);
		const diffInSeconds = Math.floor((maxEndTime - new Date()) / 1000);

        if (diffInSeconds < 0) {
            for (let i = 0; i < timeDivs.length; i++) {
                if (diffInSeconds * -1 > timeDivs[i]) {
                    return Math.floor(diffInSeconds * -1 / timeDivs[i]) + ` ${units[i]}(s) ago`;
                }
            }
        }

		for (let i = 0; i < timeDivs.length; i++) {
			if (diffInSeconds > timeDivs[i]) {
				return Math.floor(diffInSeconds / timeDivs[i]) + ` ${units[i]}(s) left`;
			}
		}

		return diffInSeconds + ' seconds(s) left';
	};
};

export default useGetTimeLeft;
