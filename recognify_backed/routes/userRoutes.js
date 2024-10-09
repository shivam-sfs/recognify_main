const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { middleware } = require("../helper/middleware/authentication");
const { uploadFiles } = require("../helper/third-party/multipart");

router.post("/login", userController.login);
router.post("/list", middleware, userController.list);
router.get("/getUserDetails/:user_id", middleware, userController.getUserDetails);
router.delete("/delete/:user_id", middleware, userController.deleteUser);
router.put("/toggleUser/:user_id", middleware, userController.saveUser);
router.post("/signUp", middleware, uploadFiles("public/profile").single('image'), userController.saveUser);
router.put("/update/:user_id", middleware, uploadFiles("public/profile").single('image'), userController.saveUser);
router.post('/send-mail-otp',userController.sendMailOtp)
router.post('/check-otp',userController.checkMailOtp)
router.post("/forgetPassword", userController.forgetPassword);


module.exports = router;
