const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./usersModel"); // Импортируем модель User
const Posts = require("./postsModel")

const Comments = sequelize.define("Comments", {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Posts,
            key: "post_id",
        },
    },
    comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: "comments"
});

Comments.belongsTo(User, { foreignKey: "user_id", as: "users" });
Comments.belongsTo(Posts, { foreignKey: "post_id", as: "posts" });

// User.hasMany(Posts, { foreignKey: "user_id", as: "posts" });

module.exports = Comments;