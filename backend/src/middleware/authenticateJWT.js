import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware to authenticate and verify JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization; // Get token from Authorization header

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract token part after 'Bearer'

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);  // Token invalid or expired
            }

            req.user = user;  // Attach the decoded user data to req.user
            next();  // Continue to the next middleware or route handler
        });
    } else {
        res.sendStatus(401);  // No token provided
    }
};

export default authenticateJWT;