const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController.js");
const { middleware } = require("../helper/middleware/authentication");

router.post("/list", middleware, paymentController.list);
router.post("/add", middleware, paymentController.save);
router.put("/update/:id", middleware, paymentController.save);
router.put("/toggle/:id", middleware, paymentController.save);
router.delete("/delete/:id", middleware, paymentController.delete);

module.exports = router;
