//Variables and imports
const userSchema = require("../models/users");
const QRCode = require("qrcode");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//Functions

//--Profile--//

const GetProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userSchema.findById(id);
  if (user) {
    delete user._doc.password && delete user._doc.__v;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

//--WhatsApp--//

const AddWhatsApp = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { number } = req.body;
  if (!number) return res.status(403).json({ message: "Number required" });
  if (number.length > 11 || number.length < 11)
    return res.status(403).json({ message: "Invalid number" });
  await userSchema.findById(id).then(async (user) => {
    if (!user) return res.status(404).json({ message: "User not found" });
    user.whatsApp = number;
    await user.save();
    res.sendStatus(200);
  });
});

const GetWhatsApp = asyncHandler(async (req, res) => {
  const { number } = req.params;
  if (!number) return res.status(403).json({ message: "Number required" });
  await userSchema.findOne({ whatsApp: number }).then(async (user) => {
    if (!user) return res.status(404).json({ message: "User not found" });
    delete user._doc.password &&
      delete user._doc.role &&
      delete user._doc.__v &&
      delete user._doc.QR;
    res.status(200).json({ user });
  });
});

// Update Profile //

const editUserInfo = async (req, res) => {
  const { id } = req.body;
  const changed = req.query;
  const user = await userSchema.findById(id);
  if (user) {
    if (changed.username) {
      await userSchema
        .findByIdAndUpdate(id, { username: changed.username })
        .then(() => {
          res.sendStatus(200);
        });
    } else if (changed.email) {
      await userSchema
        .findByIdAndUpdate(id, { email: changed.email })
        .then(() => {
          res.sendStatus(200);
        });
    } else {
      const newpassword = await bcrypt.hash(password, 10);
      await userSchema
        .findByIdAndUpdate(id, { password: newpassword })
        .then(() => {
          res.sendStatus(200);
        });
    }
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

//change password //

const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const user = await userSchema.findById(userId);
  if (!user) {
    res.status(404).json({ message: "user not found" });
  } else {
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ msg: "Password Not Match" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Not Match" });
    } else {
      await userSchema
        .findByIdAndUpdate(userId, {
          password: await bcrypt.hash(newPassword, 10),
        })
        .exec();
      res.sendStatus(200);
    }
  }
};



module.exports = {
  GetProfile,
  AddWhatsApp,
  GetWhatsApp,
  editUserInfo,
  changePassword,
};
