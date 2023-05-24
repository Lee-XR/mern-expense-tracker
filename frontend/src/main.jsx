import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';

import App from './App.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SheetsPage from './pages/SheetsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import IndividualSheet from './components/sheets/IndividualSheet.jsx';

import { UserContextProvider } from './context/UserContext.jsx';
import { SheetsContextProvider } from './context/SheetsContext.jsx';
import { ActionFormContextProvider } from './context/ActionFormContext.jsx';
import { ToastContextProvider } from './context/ToastContext.jsx';

import './styles/index.css';

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <App />,
			errorElement: <ErrorPage />,
			children: [
				{
					path: 'login',
					element: <LoginPage />,
				},
				{
					path: '/',
					element: <HomePage />,
				},
				{
					path: 'sheets/',
					element: <SheetsPage />,
					children: [
						{
							path: ':id',
							element: <IndividualSheet />,
						},
					],
				},
				{
					path: 'profile',
					element: <ProfilePage />,
				},
			],
		},
	],
	{
		basename: '/',
	}
);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<UserContextProvider>
			<SheetsContextProvider>
				<ActionFormContextProvider>
					<ToastContextProvider>
						<RouterProvider router={router} />
					</ToastContextProvider>
				</ActionFormContextProvider>
			</SheetsContextProvider>
		</UserContextProvider>
	</React.StrictMode>
);

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';
