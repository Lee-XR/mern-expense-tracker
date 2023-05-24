
const currencyFormat = new Intl.NumberFormat(['ms', 'en-us'], {
	style: 'currency',
	currency: 'MYR',
	minimumFractionDigits: 2,
});

const useConvertToCurrency = () => {
    return (amount) => {
        return currencyFormat.format(amount);
    }
}
 
export default useConvertToCurrency;