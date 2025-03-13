const Posts = require("../models/postsModel")
const User = require("../models/usersModel")
const Likes = require("../models/likesModel")

// Получить все посты с именами пользователей
const getAllLikes = async (req, res) => {
    try {
        const likes = await Likes.findAll({
            include: [
                { model: User, as: "users", attributes: ["id", "first_name", "email"] },
                { model: Posts, as: "posts", attributes: ["post_id", "title"] },
            ],
        });
        res.json(likes);
    } catch (error) {
        console.error("Ошибка при получении лайков:", error);
        res.status(500).json({ error: "Ошибка при получении лайков" });
    }
}

const addLike = async (req, res) => {
    const { user_id, post_id } = req.body
    try {
        const like = await Likes.findOne({ where: { user_id, post_id } })

        if (like) {
            await Likes.destroy({ where: { user_id, post_id } })
            return res.json({ message: "Лайк удален" })
        } else {
            await Likes.create({ user_id, post_id })
            return res.json({ message: "Лайк добавлен" })
        }
    } catch (error) {
        console.error("Ошибка лайка:", error)
        res.status(500).json({ error: "Ошибка лайка" })
    }
}

module.exports = { getAllLikes, addLike };