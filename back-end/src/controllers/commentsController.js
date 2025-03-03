const Posts = require("../models/postsModel");
const User = require("../models/usersModel");
const Comments = require("../models/commentsModel");

// Получить все посты с именами пользователей
const getAllComments = async (req, res) => {
    try {
        const comments = await Comments.findAll({
            include: [
                { model: User, as: "users", attributes: ["id", "first_name", "email"] },
                { model: Posts, as: "posts", attributes: ["post_id", "title"] },
            ],
        });
        res.json(comments);
    } catch (error) {
        console.error("Ошибка при получении комментов:", error);
        res.status(500).json({ error: "Ошибка при получении комментов" });
    }
};

const createComment = async (req, res) => {
    try {
        const { user_id, post_id, comment_text } = req.body;
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }
        const post = await Posts.findByPk(post_id)
        if (!post) {
            return res.status(404).json({ error: "Post не найден" });
        }
        const newComment = await Comments.create({ user_id, post_id, comment_text });
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Ошибка при создании comment:", error);
        res.status(500).json({ error: "Ошибка при создании comment" });
    }
};


module.exports = { getAllComments, createComment };
