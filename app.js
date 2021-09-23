const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
	res.json({
		message: 'API test'
	});
});

app.get('/api/posts', verifyToken, (req, res) => {
	res.json({
		message: 'Post created',
		authData: req.authData,
	});
});

app.get('/api/login', (req, res) => {
	// Mock user - there should be authentication to log the user in etc
	const user = {
		id: 1,
		username: 'testuser',
		email: 'test@test.com',
	};
	
	// sign - expires in 30 seconds 
	jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {
		res.json({
			token
		});
	});
});

function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers.authorization; // Authorization: Bearer <access_token>
	// Check if bearer is undefined
	if (bearerHeader !== undefined) {
		// split at space
		const bearer = bearerHeader.split(' ');
		// Get token from array
		const bearerToken = bearer[1];
		// Verify token
		jwt.verify(bearerToken, 'secretkey', (err, authData) => {
			if (err) {
				// Forbidden
				res.status(403).json({
					message: 'Forbidden',
					error: 'Authorization failed',
				});
			} else {
				// verified ok, next middleware
				req.authData = authData;
				next();
			}
		});
	} else {
		// Forbidden
		res.status(403).json({
			message: 'Forbidden',
			error: 'Authorization failed',
		});
	}
};

const port = 3000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});