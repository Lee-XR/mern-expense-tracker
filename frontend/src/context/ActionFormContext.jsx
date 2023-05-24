import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const ActionFormContext = createContext(false);

export const ActionFormContextProvider = (props) => {
    const [openActionForm, setOpenActionForm] = useState(false);
    const [actionForm, setActionForm] = useState(null);

    return (
        <ActionFormContext.Provider value={{openActionForm, setOpenActionForm, actionForm, setActionForm}}>
            {props.children}
        </ActionFormContext.Provider>
    )
}

ActionFormContextProvider.propTypes = {
    children: PropTypes.node
}