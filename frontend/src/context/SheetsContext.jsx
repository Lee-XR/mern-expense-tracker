import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
	sheets: [],
};

const sheetsReducer = (state, action) => {
	switch (action.type) {
		case 'GET_SHEETS':
			return {
				sheets: [...action.payload],
			};

		case 'ADD_NEW_SHEETS':
			return {
				sheets: [...state.sheets, action.payload],
			};

		case 'UPDATE_SHEETS': {
			const newState = [
				...state.sheets.filter((sheet) => sheet._id !== action.payload._id),
				action.payload,
			];

			const sortedState = [
				...newState.sort((a, b) => {
					if (a._id < b._id) return -1;
					if (a._id > b._id) return 1;
					return 0;
				}),
			];

			return {
				sheets: [...sortedState]
			};
		}

		case 'DELETE_SHEETS': {
			return {
				sheets: state.sheets.filter((sheet) => sheet._id !== action._id),
			};
		}

		default:
			return [...state];
	}
};

const SheetsContext = createContext(initialState);

const SheetsContextProvider = (props) => {
	const [sheetsState, sheetsDispatch] = useReducer(sheetsReducer, initialState);

	return (
		<SheetsContext.Provider value={{ ...sheetsState, sheetsDispatch }}>
			{props.children}
		</SheetsContext.Provider>
	);
};

SheetsContextProvider.propTypes = {
	children: PropTypes.node,
};

export { SheetsContext, SheetsContextProvider };
