const userSchema = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const { SendOTP, VerifyOTP } = require("../config/OTP");
const cloudinary = require("cloudinary").v2;
//register//

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const createAcount = async (req, res) => {
  const { username, email, password, confirmpassword, role } = req.body;
  if (!username || !email || !password || !confirmpassword || !role) {
    res.status(403).json({ message: "All Fields Are Required ." });
  } else {
    if (password !== confirmpassword) {
      res.status(403).json({ message: "Password Does Not Match" });
    } else {
      const user = await userSchema.findOne({ email });
      if (!user) {
        const hashedpassword = await bcrypt.hash(password, 10);
        const newuser = await userSchema.create({
          username,
          email,
          password: hashedpassword,
          role,
        });
        const qrCodeData = JSON.stringify(newuser);
        const qrCodeOptions = {
          errorCorrectionLevel: "H",
          type: "png",
          quality: 0.92,
          margin: 1,
        };
        const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, qrCodeOptions);
        const QR = (await cloudinary.uploader.upload(qrCodeDataURL)).secure_url;
        newuser.QR = QR;
        await newuser.save();
        delete newuser._doc.password && delete newuser._doc.__v;
        res.status(201).json(newuser);
      } else {
        res.status(409).json({ message: "User already exists." });
      }
    }
  }
};

//login

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(403).json({ message: "All Fields Are Required." });
  } else {
    const founduser = await userSchema.findOne({ email });
    if (founduser) {
      const matchingPassword = await bcrypt.compare(
        password,
        founduser.password
      );

      if (matchingPassword) {
        const token = jwt.sign(
          {
            id: founduser.id,
            role: founduser.role,
          },
          process.env.TOKEN,
          { expiresIn: "30d" }
        );

        delete founduser._doc.password && delete founduser._doc.__v;
        res.status(200).json({ founduser, token });
      } else {
        res.status(404).json({ message: "Password is incorrect" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
};

//forget

const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userSchema.findOne({ email: email });
    if (!user)
      return res.status(403).json({ message: "Cant't Find Your Email" });
    else {
      await SendOTP(email);
      res.sendStatus(200);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const VerifyTheOtp = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const validate = await VerifyOTP(otp, email);
    const user = await userSchema.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
    } else {
      if (!validate) {
        res.status(403).json({ message: "Invalid OTP" });
      } else {
        res.status(200).json({ id: user._id });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UpdatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  try {
    const user = await userSchema.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const validate = await bcrypt.compare(oldPassword, user.password);
      if (validate) {
        if (newPassword === confirmNewPassword) {
          user.password = await bcrypt.hash(newPassword, 10);
          await user.save();
          res.sendStatus(200);
        } else {
          res
            .status(403)
            .json({ message: "New password should match confirm." });
        }
      } else {
        res.status(403).json({ message: "Password mismatch" });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const textFucntion = async (req, res) => {
  res.status(200).json([
    { name: waleed, age: 21 },
    { name: omar, age: 22 },
    { name: zizo, age: 2 },
  ]);
};
module.exports = {
  createAcount,
  login,
  ForgetPassword,
  VerifyTheOtp,
  UpdatePassword,
  textFucntion,
};
