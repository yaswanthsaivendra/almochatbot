const express = require('express');
const { chat } = require('../controllers/controllers');
const router = express.Router();


router.route("/").post(chat);


module.exports = router;