const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Loans', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'Users', // Name of the target model
            key: 'id', // Key in the target model that the foreign key refers to
            },
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Pending", "Approved", "Rejected"]]
            },
            defaultValue: "Pending",
        },
        total_paid: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        remaining_balance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: this.amount,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
        timestamps: false,
    });
};