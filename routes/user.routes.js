const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middlewares/auth.middleware");
const upload = require("../middlewares/cloudinary.middleware");

//create a user route
router.post("/signup", async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };
    const createdUser = await UserModel.create(hashedUser);
    console.log("made it to the signup route", createdUser);
    res.status(200).json({ message: "made it here, nice work", createdUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
});
//Loggin in a existing user
router.post("/login", async (req, res) => {
  try {
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
      res.status(403).json({ message: "Invalid Credentials" });
    } else {
      const doesPasswordsMatch = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      console.log("does the password match", doesPasswordsMatch);
      if (doesPasswordsMatch) {
        const data = {
          _id: foundUser._id,
          username: foundUser.username,
          profileImage: foundUser.profileImage,
        };

        const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "5h",
        });

        console.log("Here is the authToken", authToken);
        res.status(200).json({ message: "successful login", authToken });
      } else {
        res.status(403).json({ message: "Invalid Credentials" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in the user" });
  }
});
//router to verify the token
router.get("/verify", authenticateUser, async (req, res) => {
  console.log("verify route", req.payLoad);
  const currentUser = await UserModel.findById(req.payLoad._id);
  res.status(200).json({ message: "token is valid", currentUser });
});
router.post(
  "/profileImage/:userId",
  upload.single("imageUrl"),
  async (req, res) => {
    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { profileImage: req.file.path },
        { new: true }
      );
      console.log("update drive", updateUser);
      res.status(200).json(updateUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error logging in the user" });
    }
  }
);
module.exports = router;
