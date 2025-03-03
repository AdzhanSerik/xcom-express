const express = require("express")
const router = express.Router()
const { getAllComments, createComment } = require("../controllers/commentsController")

router.get('/comments/', getAllComments)
router.post('/comments/', createComment)


module.exports = router
