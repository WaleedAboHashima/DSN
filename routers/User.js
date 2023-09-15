const { GetProfile, AddWhatsApp, GetWhatsApp,editUserInfo ,changePassword } = require("../controllers/User");


const router = require("express").Router();

router.get("/profile/:id", GetProfile);
router.post('/whatsapp', AddWhatsApp);
router.get('/searchnumber/:number', GetWhatsApp)
router.put("/editUserInfo", editUserInfo);
router.post('/changepassword/:userId', changePassword);
module.exports = router;
