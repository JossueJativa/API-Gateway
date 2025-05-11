const { User } = require('../models/user');
const { Op } = require('sequelize');

const validateFieldExists = async (field, value, excludeId = null) => {
    const whereClause = { [field]: value };
    if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
    }
    return await User.findOne({ where: whereClause });
};

module.exports = {
    validateFieldExists,
};