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

// Создать новый пост
// const createPost = async (req, res) => {
//     try {
//         const { user_id, title, text_post } = req.body;

//         // Проверяем, существует ли пользователь
//         const user = await User.findByPk(user_id);
//         if (!user) {
//             return res.status(404).json({ error: "Пользователь не найден" });
//         }

//         // Создаём новый пост
//         const newPost = await Posts.create({ user_id, title, text_post });

//         // Возвращаем созданный пост
//         res.status(201).json(newPost);
//     } catch (error) {
//         console.error("Ошибка при создании поста:", error);
//         res.status(500).json({ error: "Ошибка при создании поста" });
//     }
// };


module.exports = { getAllComments };
