const router = require("express").Router();
const authenticateUser = require("../middlewares/auth.middleware");
const DriveModel = require("../models/Drive.model");
const UserModel = require("../models/User.model");
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
    const currentUser = await UserModel.findById(theUserId).populate("trips");
    console.log("here are the users drives", allDrivesForOneUser);
    res.status(200).json({ Drives: allDrivesForOneUser, currentUser });
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
//delete one drive based on the id in the url
router.delete("/delete/:driveId", async (req, res) => {
  try {
    const deletedDrive = await DriveModel.findByIdAndDelete(req.params.driveId);
    console.log("deleted drive", deletedDrive);
    res.status(200).json(deletedDrive);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting the drive" });
  }
});
router.get("/edit-drive/:driveId", async (req, res) => {
  try {
    const editDrive = await DriveModel.findById(req.params.driveId);
    console.log("edit drive", editDrive);
    res.status(200).json(editDrive);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error edit the drive" });
  }
});
router.get("/details/:driveId", async (req, res) => {
  try {
    const editDrive = await DriveModel.findById(req.params.driveId).populate(
      "owner travelers"
    );
    console.log("detail drive", editDrive);
    res.status(200).json(editDrive);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error edit the drive" });
  }
});
router.put("/update/:driveId", async (req, res) => {
  try {
    const editDrive = await DriveModel.findByIdAndUpdate(
      req.params.driveId,
      req.body,
      { new: true }
    );
    console.log("update drive", editDrive);
    res.status(200).json(editDrive);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error edit the drive" });
  }
});
router.get("/join/:userId/:driveId", async (req, res) => {
  try {
    const joinDrive = await DriveModel.findByIdAndUpdate(req.params.driveId, {
      $push: { travelers: req.params.userId },
    });
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        $push: { trips: req.params.driveId },
      },
      { new: true }
    );
    console.log("join drive", joinDrive);
    res.status(200).json({ joinDrive, updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error join the drive" });
  }
});
module.exports = router;
