import { createContext, useReducer } from "react";
import PropTypes from 'prop-types'

const initialState = {
    userExists: false
}

const userReducer = (state, action) => {
    switch (action.type) {
        case 'USER_EXIST':
            return {
                userExists: true,
                ...action.payload
            }

        case 'USER_UPDATE':
            return {
                userExists: true,
                ...state,
                ...action.payload
            }

        case 'USER_LOGOUT':
            return {
                ...initialState
            }

        default: 
            return {
                ...state
            }
    }
}

const UserContext = createContext(initialState);

const UserContextProvider = (props) => {
    const [userState, userDispatch] = useReducer(userReducer, initialState);

    return (
        <UserContext.Provider value={{...userState, userDispatch}}>
            {props.children}
        </UserContext.Provider>
    )
}

UserContextProvider.propTypes = {
    children: PropTypes.node
}


export { UserContext, UserContextProvider }
