import { useContext, useState } from 'react';
import { useHandleError, useHandleSuccess } from '../../hooks/useHandleResponse';
import axios from 'axios';

import { UserContext } from '../../context/UserContext';
import style from '../../styles/components/actionForm.module.css';

const UpdateProfileForm = () => {
	const { _id, username, email, userDispatch } = useContext(UserContext);

	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

    const [updatedUsername, setUpdatedUsername] = useState(username);
    const [updatedEmail, setUpdatedEmail] = useState(email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

	const updateProfile = async (e) => {
        e.preventDefault();

        const data = {
            _id: _id,
            username: updatedUsername,
            email: updatedEmail,
            currentPassword: currentPassword,
            newPassword: newPassword
        }

        await axios.post('user/update', data)
            .then((response) => {
				if (response.data.success) {
					userDispatch({type: 'USER_UPDATE', payload: response.data.user});
					sessionStorage.setItem('userContext', JSON.stringify(response.data.user));
	
					const title = `${username} Profile Updated`;
					const description = 'User profile has been successfully updated.';
					handleSuccess(title, description);
	
					setCurrentPassword('');
					setNewPassword('');
				}
            })
            .catch((error) => {
                handleError(error);
            });

    };

	return (
		<div className={style.formItem}>
			<h2>Update Profile</h2>
			<form onSubmit={updateProfile}>
				<div className={style.inputItem}>
					<label htmlFor='updated-username'>Username:</label>
					<input
						type='text'
						name='updated-username'
						id='updated-username'
						value={updatedUsername}
						onChange={(e) => setUpdatedUsername(e.target.value)}
						required
						aria-required
					/>
				</div>

                <div className={style.inputItem}>
					<label htmlFor='updated-email'>Email:</label>
					<input
						type='text'
						name='updated-email'
						id='updated-email'
						value={updatedEmail}
						onChange={(e) => setUpdatedEmail(e.target.value)}
						required
						aria-required
					/>
				</div>

                <div className={style.inputItem}>
					<label htmlFor='current-password'>Current Password:</label>
					<input
						type='password'
						name='current-password'
						id='current-password'
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						required
						aria-required
					/>
				</div>

                <div className={style.inputItem}>
					<label htmlFor='new-password'>New Password:</label>
					<input
						type='password'
						name='new-password'
						id='new-password'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
						aria-required
					/>
				</div>

                <button className={style.submitButton}>Update</button>
			</form>
		</div>
	);
};

export default UpdateProfileForm;
