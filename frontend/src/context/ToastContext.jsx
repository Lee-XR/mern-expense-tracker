import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import ToastBox from '../components/ToastBox';

import * as Toast from '@radix-ui/react-toast';

const ToastContext = createContext(false);

const initState = [];
let nextId = 0;

const toastReducer = (state, action) => {
	switch (action.type) {
		case 'REMOVE_TOAST':
			return [...state.filter((toast) => toast.id !== action.id)];

		case 'ADD_TOAST': {
			const newToast = {
				id: nextId++,
				...action.payload,
			};
			return [...state, newToast];
		}
	}
};

const ToastContextProvider = (props) => {
	const [toastState, toastDispatch] = useReducer(toastReducer, initState);

	return (
		<ToastContext.Provider value={{ toastDispatch }}>
			{props.children}
			<Toast.Provider>
				{toastState.map((toast) => (
					<ToastBox
						key={toast.id}
						options={toast}
					/>
				))}
			</Toast.Provider>
		</ToastContext.Provider>
	);
};

ToastContextProvider.propTypes = {
	children: PropTypes.node,
};

export { ToastContext, ToastContextProvider };
