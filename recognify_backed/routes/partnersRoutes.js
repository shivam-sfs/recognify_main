const express = require("express");
const router = express.Router();
const partnersController = require("../controllers/partnersController");
const { middleware } = require("../helper/middleware/authentication");
const { uploadDocument } = require("../helper/third-party/multipart");


router.post("/list", middleware, partnersController.list);
router.post(
  "/add",
  middleware,
  uploadDocument("public/resume").single("resume"),
  partnersController.savePartners
);
router.put(
  "/update/:partner_id",
  middleware,
  uploadDocument("public/resume").single("resume"),
  partnersController.savePartners
);
router.put("/toggle/:partner_id", middleware, partnersController.savePartners);
router.delete("/delete/:partner_id", middleware, partnersController.delete);
router.post("/work_list", middleware, partnersController.work_list);

module.exports = router;
