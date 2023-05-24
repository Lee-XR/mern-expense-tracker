import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useHandleError, useHandleSuccess } from '../hooks/useHandleResponse';
import axios from 'axios';

import { UserContext } from '../context/UserContext';
import * as Switch from '@radix-ui/react-switch';

import style from '../styles/loginPage.module.css';

const LoginPage = () => {
	const { userDispatch } = useContext(UserContext);

	const [newUser, setNewUser] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');

	const navigate = useNavigate();
	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	const loginRef = useRef(null);
	const registerRef = useRef(null);
	const nodeRef = newUser ? registerRef : loginRef;

	// Submit new user info to register
	const userRegister = async (e) => {
		e.preventDefault();
		const data = { email, password, username };

		await axios
			.post('user/register', data)
			.then((response) => {
				if (response.data.success) {
					userDispatch({ type: 'USER_EXIST', payload: response.data.user });
					navigate('/home');

					const title = `Welcome ${response.data.user.username}`;
					const description = 'User has successfully registered.';
					handleSuccess(title, description);
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	// Submit existing user info to login
	const userLogin = async (e) => {
		e.preventDefault();
		const data = { email, password };

		await axios
			.post('user/login', data)
			.then((response) => {
				if (response.data.success) {
					userDispatch({ type: 'USER_EXIST', payload: response.data.user });
					navigate('/home');
					
					const title = `Welcome ${response.data.user.username}`;
					const description = 'User has successfully logged in.';
					handleSuccess(title, description);
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	// Auto clear user context
	useEffect(() => {
		userDispatch({type: 'USER_LOGOUT'});
	}, []);

	// Clear user input states
	useEffect(() => {
		setEmail('');
		setPassword('');
		setUsername('');
	}, [newUser]);

	return (
		<div className={style.container}>
			<div className={style.form}>
				<h1>Income & Expense Tracker</h1>

				{/* Toggle user login or register */}
				<div className={style.userTypeToggle}>
					<label htmlFor='user-type'>
						<b>{newUser ? 'New' : 'Existing'}</b> user
					</label>
					<Switch.Root
						className={style.userTypeSwitchRoot}
						id='user-type'
						onCheckedChange={() => {
							setNewUser((newUser) => !newUser);
						}}
					>
						<Switch.Thumb className={style.userTypeSwitchThumb} />
					</Switch.Root>
				</div>

				<SwitchTransition>
					<CSSTransition
						key={newUser}
						nodeRef={nodeRef}
						appear={true}
						mountOnEnter={true}
						unmountOnExit={true}
						addEndListener={(done) =>
							nodeRef.current.addEventListener('transitionend', done, false)
						}
						classNames={newUser ? 'slideLeft' : 'slideRight'}
					>
						{/* Form inputs */}
						<div
							ref={nodeRef}
							className={style.userInput}
						>
							{!newUser && (
								<div
									ref={nodeRef}
									className={style.loginForm}
								>
									<h2>Login</h2>
									<form onSubmit={userLogin}>
										<div className={style.inputItem}>
											<label htmlFor='login-email'>Email:</label>
											<input
												type='text'
												name='login-email'
												id='login-email'
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
												aria-required
											/>
										</div>
										<div className={style.inputItem}>
											<label htmlFor='login-password'>Password:</label>
											<input
												type='password'
												name='login-password'
												id='login-password'
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												required
												aria-required
											/>
										</div>

										<button>Login</button>
									</form>
								</div>
							)}

							{newUser && (
								<div
									ref={nodeRef}
									className={style.registerForm}
								>
									<h2>Register</h2>
									<form onSubmit={userRegister}>
										<div className={style.inputItem}>
											<label htmlFor='register-username'>Username:</label>
											<input
												type='text'
												name='register-username'
												id='register-username'
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												required
												aria-required
											/>
										</div>
										<div className={style.inputItem}>
											<label htmlFor='register-email'>Email:</label>
											<input
												type='text'
												name='register-email'
												id='register-email'
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
												aria-required
											/>
										</div>
										<div className={style.inputItem}>
											<label htmlFor='register-password'>Password:</label>
											<input
												type='password'
												name='register-password'
												id='register-password'
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												required
												aria-required
											/>
										</div>

										<button>Register</button>
									</form>
								</div>
							)}
						</div>
					</CSSTransition>
				</SwitchTransition>
			</div>
		</div>
	);
};

export default LoginPage;
