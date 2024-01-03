const User = require('../models/User')
const UserVerification = require('../models/UserVerification')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const nodemailerTransporter = require('../config/nodemailer')
const asyncHandler = require('express-async-handler')

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) throw new Error("400: Bad request.");

  const user = await User.findOne({ email });
  if (!user) throw new Error("404: User not found.");

  if (!(await bcryptjs.compare(password, user.password))) throw new Error("401: Invalid Credentials.");
  if (!user.verified) throw new Error("404: User not verified. Check your email to continue.");

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({
    message: "User successfully logged in.",
    name: user.name,
    email: user.email,
    token: jwtToken
  });
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) throw new Error("409: User already registered.");
  if (!(name && email && password)) throw new Error("400: Bad request.");

  const salt = await bcryptjs.genSalt(10);
  if (!salt) throw new Error("Error generating bcryptjs salt.");

  const hashedPassword = await bcryptjs.hash(password, salt);
  if (!hashedPassword) throw new Error("Error generating bcryptjs hashed password.");

  const newUser = await User.create({ name, email, password: hashedPassword });
  if (!newUser) throw new Error("Error creating new user.");

  const uniqueString = crypto.randomUUID() + newUser._id;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify your registration.",
    html:
      `<p>Verify your registration by clicking the link below<p>
         <p>It expires in 20 minutes.<p>
         <a href=${process.env.BACKEND_URL}/api/verify/${newUser._id}/${uniqueString}> CLICK ME TO VERIFY </a>
        `
  };
  const hashedUniqueString = await bcryptjs.hash(uniqueString, salt);
  if (!hashedUniqueString) throw new Error("Error generating hashed unique string for verification.");

  const newUserVerification = await UserVerification.create({
    user: newUser._id,
    uniqueString: hashedUniqueString,
    createdAt: Date.now(),
    expiresAt: Date.now() + 20 * 60 * 1000
  });
  if (!newUserVerification) throw new Error("Error creating new user verification.");

  nodemailerTransporter.sendMail(mailOptions);

  res.status(201).json({
    message: "User successfully registered.",
  });
});

const verify = asyncHandler(async (req, res) => {
  const { user, uniqueString } = req.params;

  const userVerification = await UserVerification.findOne({ user });
  if (!userVerification) throw new Error("404: Verification failed.");

  const { expiresAt } = userVerification;
  if (expiresAt < Date.now()) {
    const deletedVerification = await UserVerification.deleteOne({ user });
    if (!deletedVerification) throw new Error("Error deleting expired verification.")

    res.status(409).json({
      error: "Verification link has expired."
    });
  };

  if (!(await bcryptjs.compare(uniqueString, userVerification.uniqueString))) throw new Error("409: Verification failed due to invalid details.")

  const verifiedUser = await User.updateOne({ _id: user }, { verified: true });
  if (!verifiedUser) throw new Error("Error deleting already verified verification.");

  const deletedVerification = await UserVerification.deleteOne({ user });
  if (!deletedVerification) throw new Error("Error deleting expired verification.");

  res.status(200).json({
    message: "User verified successfully.",
    verifiedUser
  });
});

module.exports = {
  login,
  register,
  verify
}