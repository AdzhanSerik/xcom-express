const express = require("express")
const router = express.Router()
const { getAllLikes, addLike } = require("../controllers/likesController")

router.get('/likes/', getAllLikes)
router.post("/likes", addLike)

module.exports = router