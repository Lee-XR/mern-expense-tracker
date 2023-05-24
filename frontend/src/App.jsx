import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useHandleError, useHandleSuccess } from './hooks/useHandleResponse';
import useFetchSheets from './hooks/useFetchSheets';
import axios from 'axios';

import { UserContext } from './context/UserContext';
import { SkeletonTheme } from 'react-loading-skeleton';
import NavBar from './components/NavBar';
import Header from './components/Header';
import ActionForm from './components/forms/ActionForm';
import QuickAddButtons from './components/QuickAddButtons';

import './styles/index.css';

function App() {
	const { userExists, userDispatch } = useContext(UserContext);
	const fetchSheets = useFetchSheets();

	const isScreenSmaller = useMediaQuery({ maxWidth: 750 });
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [gridDisplay, setGridDisplay] = useState('1fr');

	const navigate = useNavigate();
	const { pathname } = useLocation();
	const handleError = useHandleError();
	const handleSuccess = useHandleSuccess();

	// Open / close nav bar
	const toggleNav = () => {
		setIsNavOpen(!isNavOpen);
	};

	// Refresh user session
	const refreshUser = async () => {
		await axios
			.get('/user/refresh')
			.then((response) => {
				let title = '';
				let description = '';
				if (response.data.success) {
					userDispatch({ type: 'USER_EXIST', payload: response.data.user });
					title = `Welcome back ${response.data.user.username}`;
					description = 'User has returned to session.';
					handleSuccess(title, description);
				} else {
					// title = 'Expired session';
					// description = 'User session has expired.';
					navigate('/login');
				}
			})
			.catch((error) => {
				handleError(error);
			});
	};

	// Intercept 401 response & redirect to login page
	axios.interceptors.response.use(function(response) {
		return response;
	}, function(error) {
		if (error.response.status === 401) {
			navigate('/login');
		}
		return Promise.reject(error);
	})

	// Refresh user session if user still exists or fetch sheets
	useEffect(() => {
		if (pathname !== '/login') {
			if (userExists) {
				fetchSheets();
			} else {
				refreshUser();
			}
		}
	}, [userExists]);

	// Auto close nav bar when screen smaller
	useEffect(() => {
		setIsNavOpen(!isScreenSmaller);
	}, [isScreenSmaller]);

	// Set grid display when nav open or close
	useEffect(() => {
		if (userExists) {
			if (isScreenSmaller) {
				setGridDisplay('minmax(0, 1fr)');
			} else {
				if (isNavOpen) {
					setGridDisplay('250px minmax(0, 1fr)');
				} else {
					setGridDisplay('0 minmax(0, 1fr)');
				}
			}
		} else {
			setGridDisplay('minmax(0, 1fr)');
		}
	}, [userExists, isNavOpen]);

	// Scroll to top on route change
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<div
			id='display'
			style={{ '--grid-display': gridDisplay }}
		>
			{!userExists && <Outlet />}

			{userExists && (
				<>
					<NavBar
						isScreenSmaller={isScreenSmaller}
						isNavOpen={isNavOpen}
						toggleNav={toggleNav}
					/>
					<main>
						<Header
							isNavOpen={isNavOpen}
							toggleNav={toggleNav}
						/>

						<SkeletonTheme
							baseColor='#E1E1E1'
							highlightColor='#FAFAFA'
						>
							<div id='dashboard'>
								{/* Opens action form */}
								{createPortal(<ActionForm />, document.body)}

								{/* Quick actions button */}
								{createPortal(<QuickAddButtons />, document.body)}

								<Outlet />
							</div>
						</SkeletonTheme>
					</main>
				</>
			)}
		</div>
	);
}

export default App;
