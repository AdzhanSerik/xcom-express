const express = require("express")
const router = express.Router()
const { getAllComments } = require("../controllers/commentsController")

router.get('/comments/', getAllComments)

module.exports = router