const router = require("express").Router();
const authenticateUser = require("../middlewares/auth.middleware");
const DriveModel = require("../models/Drive.model");
//router to create a drive
router.post("/create", authenticateUser, async (req, res) => {
  try {
    const createdDrive = await DriveModel.create({
      ...req.body,
      owner: req.payLoad._id,
    });
    console.log("drive created", createdDrive);
    res.status(201).json({ message: "drive created, good job", createdDrive });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error loggin in the user" });
  }
});
//find all drives for one specific user
router.get("/user-drives/:userId", async (req, res) => {
  const theUserId = req.params.userId;
  try {
    const allDrivesForOneUser = await DriveModel.find({
      owner: theUserId,
    }).populate("owner");
    console.log("here are the users drives", allDrivesForOneUser);
    res.status(200).json({ userDrives: allDrivesForOneUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error finding the drives" });
  }
});
module.exports = router;
