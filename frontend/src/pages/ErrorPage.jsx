import { useRouteError } from "react-router-dom";

import style from '../styles/errorPage.module.css'

const ErrorPage = () => {
    const error = useRouteError();

    return ( 
        <div className={style.body}>
            <div className={style.container}>
                <h1>{ error.status } {error.statusText} Page Error</h1>
                <p>{ error.data }</p>
            </div>
        </div>
     );
}
 
export default ErrorPage;