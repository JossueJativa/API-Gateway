const { response } = require("express");
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');

const revokedTokens = new Set();

const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // Check email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({
                msg: 'User/Password are not correct'
            });
        }

        // Check if user is active
        if (!user.status) {
            return res.status(400).json({
                msg: 'User/Password are not correct - status: false'
            });
        }

        // Check password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User/Password are not correct'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error',
        });
    }
}

const logout = async (req, res = response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            msg: 'Token is required',
        });
    }

    try {
        // Add the token to the revoked tokens list
        revokedTokens.add(token);

        res.json({
            msg: 'Logout successful',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error',
        });
    }
};

const isTokenRevoked = (token) => revokedTokens.has(token);

module.exports = {
    login,
    logout,
    isTokenRevoked,
};