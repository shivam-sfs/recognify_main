const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { middleware } = require("../helper/middleware/authentication");
const { uploadFiles } = require("../helper/third-party/multipart");

router.post("/list", middleware, leadController.list);
router.post(
  "/add",
  uploadFiles("public/profile").single("image"),
  leadController.saveLead
);
router.put("/update/:lead_id", middleware, leadController.saveLead);
router.put("/toogle/:lead_id", middleware, leadController.saveLead);
router.delete("/delete/:lead_id", middleware, leadController.delete);

module.exports = router;
