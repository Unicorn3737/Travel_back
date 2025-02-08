const router = require("express").Router();
const authenticateUser = require("../middlewares/auth.middleware");
const DriveModel = require("../models/Drive.model");
//router to create a drive
router.post("/create", authenticateUser, async (req, res) => {
  console.log(req.body);
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
    res.status(200).json(allDrivesForOneUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error finding the drives" });
  }
});
router.get("/all-drives", async (req, res) => {
  try {
    const allDrives = await DriveModel.find().populate("owner");
    console.log("here are all drives", allDrives);
    res.status(200).json(allDrives);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error finding the drives" });
  }
});
module.exports = router;
