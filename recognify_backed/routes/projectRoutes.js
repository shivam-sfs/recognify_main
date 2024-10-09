const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { middleware } = require("../helper/middleware/authentication");
const { uploadDocument } = require("../helper/third-party/multipart");

router.post("/list", middleware, projectController.list);
router.post("/add", middleware, uploadDocument("public/project").single("files"), projectController.save);
router.put("/update/:id", middleware,uploadDocument("public/project").single("files"), projectController.save);
router.put("/toggle/:id", middleware, projectController.save);
router.delete("/delete/:id", middleware, projectController.delete);

module.exports = router;
