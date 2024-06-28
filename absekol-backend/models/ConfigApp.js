const { sequelize, DataTypes } = require('../config/db');

const ConfigApp = sequelize.define('ConfigApp',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        configName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        value: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: 'ConfigApp',
        timestamps: true
    }
)

module.exports = ConfigApp;