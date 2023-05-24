// require module init
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// cors options
const corsOptions = {
	credentials: true,
	origin: 'https://mern-expense-tracker-three.vercel.app',
	methods: ['GET', 'POST', 'PATCH'],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Origin',
		'Accept',
        'Cookie',
	],
};
app.use(cors(corsOptions));

// express session options
const sessionOptions = {
	name: 'user_session',
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: false,
	rolling: true,
	cookie: {
		maxAge: 600000,
	},
	store: MongoStore.create({
		mongoUrl: process.env.MONGO_URI
	})
}

if (process.env.NODE_ENV === 'production') {
	sessionOptions.cookie.secure = true;
	sessionOptions.cookie.sameSite = 'none';
}

app.set('trust proxy', 1);
app.use(session(sessionOptions))

// routes
const userRoutes = require('./routes/userRoute');
app.use('/api/user', userRoutes);
const sheetRoutes = require('./routes/sheetRoute');
app.use('/api/sheet', sheetRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(port, () => {
			console.log(`Connected at port ${port}`);
		});
	})
	.catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(process.cwd(), './frontend', 'dist')));
	app.get('/*', (req, res) => {
		res.sendFile(path.join(process.cwd(), './frontend', 'dist', 'index.html'));
	})
}