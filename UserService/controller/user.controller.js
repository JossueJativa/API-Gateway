const bycryptjs = require('bcryptjs');
const { request, response } = require('express');
const { validationResult } = require('express-validator');

const { User } = require('../models/user');
const { validateFieldExists } = require('../helpers/controller_validator');

const userGet = async (req = request, res = response) => {
    const { limit = 5, offset = 0 } = req.query;
    const query = { status: true };

    try {
        const [total, users] = await Promise.all([
            User.count({ where: query }),
            User.findAll({
                where: query,
                offset,
                limit,
                order: [['id', 'ASC']],
            })
        ]);

        res.status(200).json({
            total,
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error',
        });
    }
}

const userGetById = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                msg: 'User not found',
            });
        }

        res.status(200).json({
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error',
        });
    }
}

const userPost = async (req = request, res = response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { username, email, password } = req.body;
    const user = new User({ username, email, password });

    try {
        // Validate if email is already in use
        if (await validateFieldExists('email', email)) {
            return res.status(400).json({
                msg: 'Email already in use',
            });
        }

        // Validate if username is already in use
        if (await validateFieldExists('username', username)) {
            return res.status(400).json({
                msg: 'Username already in use',
            });
        }

        const salt = bycryptjs.genSaltSync();
        user.password = bycryptjs.hashSync(password, salt);

        await user.save();

        res.status(201).json({
            msg: 'User created',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error',
        });
    }
};

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    // Validate if user exists
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({
            msg: 'User not found',
        });
    }

    try {
        // Validate if email is already in use by another user
        if (email && await validateFieldExists('email', email, id)) {
            return res.status(400).json({
                msg: 'Email already in use by another user',
            });
        }

        // Validate if username is already in use by another user
        if (username && await validateFieldExists('username', username, id)) {
            return res.status(400).json({
                msg: 'Username already in use by another user',
            });
        }

        // Update user
        await user.update({
            username,
            email,
            password
        });

        res.status(200).json({
            msg: 'User updated',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error',
        });
    }
}

const userDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // Validate if user exists
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({
            msg: 'User not found',
        });
    }

    // Delete user
    try {
        await user.destroy();

        res.status(200).json({
            msg: 'User deleted',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error',
        });
    }
}

module.exports = {
    userGet,
    userGetById,
    userPost,
    userPut,
    userDelete
}