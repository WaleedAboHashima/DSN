const mailer = require("nodemailer");
const { VsAuthenticator } = require("@vs-org/authenticator");
const OTPStore = {};
exports.SendOTP = async (email) => {
  const otp = VsAuthenticator.generateTOTP(process.env.OTP_SECRET);
  OTPStore[otp] = email;
  const transporter = new mailer.createTransport({
    service: "gmail",
    auth: {
      user: "waleedsabryyyy@gmail.com",
      pass: "avupiigakzoeghxn",
    },
  });
  const options = {
    from: "DNSOTP@gmail.com",
    to: `${email}`,
    subject: "Reset password request",
    text: `Your OTP is ${otp}`,
  };
  return await transporter.sendMail(options);
};

exports.VerifyOTP = async (otp, email) => {
  const cashedEmail = OTPStore[otp];
  if (cashedEmail === email) {
    VsAuthenticator.verifyTOTP(otp, process.env.OTP_SECRET);
    delete OTPStore[otp];
    return true;
  } else {
    return false;
  }
};
