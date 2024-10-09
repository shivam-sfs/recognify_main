const express = require("express");
const router = express.Router();
const partnersWorkController = require("../controllers/partnersWorkController.js");
const { middleware } = require("../helper/middleware/authentication");


router.post("/list", middleware, partnersWorkController.list);
router.post(
  "/add",
  middleware,
  partnersWorkController.save
);
router.put(
  "/update/:id",
  middleware,
  partnersWorkController.save
);
router.delete("/delete/:id", middleware, partnersWorkController.delete);

module.exports = router;
