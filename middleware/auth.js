const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Unauthorized access! No token provided.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('_id name email');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized access! User not found.' });
        }

        req.user = user; 
        next();

    } catch (error) {

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token!' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(200).json({ success: false, message: 'INVALID_TOKEN' });
        }

        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
