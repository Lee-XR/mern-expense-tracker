import { useContext, useState } from 'react';
import { useHandleError, useHandleSuccess } from '../../hooks/useHandleResponse';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';

import style from '../../styles/components/actionForm.module.css';

const DeleteProfileForm = () => {
    const { _id, username, userDispatch } = useContext(UserContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const deleteProfile = async (e) => {
        e.preventDefault();

        const data = {
            _id: _id,
            email: userEmail,
            password: userPassword
        }

        await axios.post('user/delete', data)
            .then((response) => {
                if (response.data.success) {
                    sessionStorage.removeItem('userContext');
					userDispatch({ type: 'USER_LOGOUT' });

					const title = `${username} Profile Deleted`;
					const description = 'User profile has been succesfully deleted.'
					handleSuccess(title, description);
                }
            })
            .catch((error) => {
                handleError(error);
            })
    }

    return ( 
        <div className={style.formItem}>
			<h2>Delete Profile</h2>
			<form onSubmit={deleteProfile}>
                <div className={style.inputItem}>
					<label htmlFor='user-email'>Enter your email:</label>
					<input
						type='text'
						name='user-email'
						id='user-email'
						value={userEmail}
						onChange={(e) => setUserEmail(e.target.value)}
						required
						aria-required
					/>
				</div>

                <div className={style.inputItem}>
					<label htmlFor='user-password'>Enter your password:</label>
					<input
						type='password'
						name='user-password'
						id='user-password'
						value={userPassword}
						onChange={(e) => setUserPassword(e.target.value)}
						required
						aria-required
					/>
				</div>

                <button className={style.submitButton}>Confirm</button>
			</form>
		</div>
     );
}
 
export default DeleteProfileForm;