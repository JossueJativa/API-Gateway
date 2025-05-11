const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const { User } = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No token provided in the request',
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);

        // Find user by ID
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(401).json({
                msg: 'Token not valid - user does not exist in DB',
            });
        }

        // Check if user is active
        if (!user.status) {
            return res.status(401).json({
                msg: 'Token not valid - user status: false',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token not valid',
        });
    }
}

module.exports = validateJWT;