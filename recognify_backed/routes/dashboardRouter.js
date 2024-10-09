const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { middleware } = require("../helper/middleware/authentication");

router.post("/list", middleware, dashboardController.list);

module.exports = router;
