const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./usersModel"); // Импортируем модель User
const Posts = require("./postsModel")

const Likes = sequelize.define("Likes", {
    like_id: {
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
    }
})


Likes.belongsTo(User, { foreignKey: "user_id", as: "users" });
Likes.belongsTo(Posts, { foreignKey: "post_id", as: "posts" });

module.exports = Likes;