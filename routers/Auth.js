const {createAcount,login, ForgetPassword, VerifyTheOtp, UpdatePassword} = require("../controllers/Auth")
const imgUploader = require('../middleware/imgUploader');
const router = require("express").Router();
router.post("/signup",imgUploader.fields([{ name: 'QR' }]),createAcount);
router.post("/login",login);
router.post('/forgetpassword', ForgetPassword);
router.post('/verifyotp', VerifyTheOtp)
router.put("/newpassword/:id", UpdatePassword)

module.exports = router;