const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../db/database.sqlite'),
});

const User = sequelize.define( 'User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: 'Username cannot be empty',
            },
            len: {
                args: [10, 40],
                msg: 'Username must be between 3 and 30 characters long',
            },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Must be a valid email address',
            },
            notEmpty: {
                msg: 'Email cannot be empty',
            },
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password cannot be empty',
            },
            len: {
                args: [12, 100],
                msg: 'Password must be between 6 and 100 characters long',
            },
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Error creating database:', error);
    });

module.exports = {
    User, sequelize
};